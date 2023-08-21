<script setup lang="ts">
import { ref } from 'vue'
import { Property, Street, Railroad, Utility, Player } from '../model.ts'

defineProps<{ msg: string }>()

const properties: Array<Property> = [
  Street.HACHIOJI, Street.TACHIKAWA,
  Street.YOTSUYA, Street.YOYOGI, Street.ICHIGAYA,
  Street.AKIHABARA, Street.UENO, Street.IKEBUKURO,
  Street.ODAIBA, Street.HIBIYA, Street.SHIMBASHI,
  Street.EBISU, Street.HARAJUKU, Street.OMOTESANDO,
  Street.AKASAKA, Street.ROPPONGI, Street.TORANOMON,
  Street.YURAKUCHO, Street.NIHONBASHI, Street.OTEMACHI,
  Street.MARUNOUCHI, Street.GINZA,
  Railroad.SHINJUKU, Railroad.SHINAGAWA, Railroad.SHIBUYA, Railroad.TOKYO,
  Utility.POWER_COMPANY, Utility.WATER_COMPANY
]

const players = ref(new Array())
const addPlayer = () => {
  players.value.push(new Player())
}

const removePlayer = (index: number) => {
  players.value.splice(index, 1)
}

// 抵当
const mortgageProperty = (player: Player, property: Property) => {
  // TODO 未購入状態から抵当にすることができないので要修正
  if (!player.hasProperty(property)) {
    player.buyProperty(property)
  }
  if (player.isMortgaged(property)) {
    player.settlementProperty(property)
  } else {
    player.mortgageProperty(property)
  }
}

// 物件購入/売却
const buyProperty = (player: Player, property: Property, houseCount: number) => {
  if (!player.hasProperty(property)) {
    player.buyProperty(property)
    player.buildHouses(property, houseCount)
  } else if (houseCount > player.getHouseCount(property)) {
    player.buildHouses(property, houseCount - player.getHouseCount(property))
  } else if (houseCount < player.getHouseCount(property)) {
    player.sellHouses(property, player.getHouseCount(property) - houseCount)
  } else if (player.isMortgaged(property)) {
    player.settlementProperty(property)
  } else {
    player.sellProperty(property)
  }
}

addPlayer()
</script>

<template>
  <h1>{{ msg }}</h1>

  <button type="button" @click="addPlayer">追加</button>

  <table>
    <thead>
      <tr>
        <th></th>
        <th>物件</th>
        <th>価格</th>
        <th>建設備</th>
        <th v-for="(player, index) in players">
          <input v-model="player.name" />
          <button @click="removePlayer(index)">削除</button>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="property in properties">
        <td :style="{'background-color': property.group.color}">&nbsp;</td>
        <td>{{ property.name }}</td>
        <td>{{ property.price }}</td>
        <td>{{ !property.canBuildHouse() ? '-' : property.cost }}</td>
        <template v-for="player in players">
          <td>
            <button @click="mortgageProperty(player, property)">抵当</button>
            <button @click="buyProperty(player, property, 0)">0</button>
            <button @click="buyProperty(player, property, 1)" :disabled="!property.canBuildHouse()">1</button>
            <button @click="buyProperty(player, property, 2)" :disabled="!property.canBuildHouse()">2</button>
            <button @click="buyProperty(player, property, 3)" :disabled="!property.canBuildHouse()">3</button>
            <button @click="buyProperty(player, property, 4)" :disabled="!property.canBuildHouse()">4</button>
            <button @click="buyProperty(player, property, 5)" :disabled="!property.canBuildHouse()">ホテル</button>
            {{ player.hasProperty(property) ? player.calculatePresentValue(property) : 0 }}
          </td>
        </template>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td v-for="player in players">{{ player.calculateAllPresentValue() }}</td>
      </tr>
    </tfoot>
  </table>
</template>

<style scoped>
</style>
