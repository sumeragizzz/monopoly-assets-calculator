<script setup lang="ts">
import { ref } from 'vue'
import { Game, Player, Property } from '../model.ts'

defineProps<{ msg: string }>()

const game = ref(new Game())

const addPlayer = () => {
  game.value.addPlayer()
}

const removePlayer = (id: string) => {
  // TODO 確認ダイアログを表示する

  game.value.removePlayer(id)
}

const buyProperty = (property: Property, houseCount: number) => {
  const player: Player = game.value.getOwnedPlayer(property) ?? game.value.getAllPlayers()[0]
  player.buyProperty(property, houseCount)
}

const sellProperty = (property: Property) => {
  const player: Player | undefined = game.value.getOwnedPlayer(property)
  player?.sellProperty(property)
}

const mortgageProperty = (property: Property) => {
  const player: Player = game.value.getOwnedPlayer(property) ?? game.value.getAllPlayers()[0]
  player.mortgageProperty(property)
}
</script>

<template>
  <h1>{{ msg }}</h1>

  <table>
    <thead>
      <tr>
        <th></th>
        <th>物件</th>
        <th>価格</th>
        <th>建設備</th>
        <th></th>
        <th v-for="(player, playerIndex) in game.getAllPlayers()">
          {{ playerIndex + 1 }}:&nbsp;
          <input v-model="player.name" />
          <button @click="removePlayer(player.id)" :disabled="game.getAllPlayers().length <= 1">削除</button>
        </th>
        <th><button type="button" @click="addPlayer" :disabled="game.getAllPlayers().length >= 8">追加</button></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td></td>
        <td>合計</td>
        <td></td>
        <td></td>
        <td></td>
        <td v-for="player in game.getAllPlayers()">{{ player.money + player.calculateTotalValuation() }}</td>
        <td></td>
      </tr>
      <tr>
        <td></td>
        <td>所持金</td>
        <td></td>
        <td></td>
        <td></td>
        <td v-for="player in game.getAllPlayers()"><input type="number" v-model.number="player.money" /></td>
        <td></td>
      </tr>
      <tr>
        <td></td>
        <td>資産小計</td>
        <td></td>
        <td></td>
        <td></td>
        <td v-for="player in game.getAllPlayers()">{{ player.calculateTotalValuation() }}</td>
        <td></td>
      </tr>
      <tr v-for="property in game.getAllProperties()">
        <td :style="{'background-color': property.group.color}">&nbsp;</td>
        <td>{{ property.name }}</td>
        <td>{{ property.price }}</td>
        <td>{{ !property.buildable ? '-' : property.cost }}</td>
        <td>
          <button @click="sellProperty(property)">✕</button>
          <button @click="buyProperty(property, 0)">0</button>
          <button @click="buyProperty(property, 1)" :disabled="!property.buildable">1</button>
          <button @click="buyProperty(property, 2)" :disabled="!property.buildable">2</button>
          <button @click="buyProperty(property, 3)" :disabled="!property.buildable">3</button>
          <button @click="buyProperty(property, 4)" :disabled="!property.buildable">4</button>
          <button @click="buyProperty(property, 5)" :disabled="!property.buildable">ホテル</button>
          <button @click="mortgageProperty(property)">抵当</button>
          <select v-model="game.getPropertyStatus(property).owner">
            <option disabled>所有者を選択してください</option>
            <option :value="undefined"></option>
            <option v-for="(player, playerIndex) in game.getAllPlayers()" :value="player">{{ `${playerIndex + 1}: ${player.name}` }}</option>
          </select>
        </td>
        <!--
        <template v-for="player in players">
        </template>
        -->
        <!-- @vue-ignore -->
        <td v-for="player in game.getAllPlayers()">
          <template v-if="player.isOwnedProperty(property)">{{ game.getPropertyStatus(property).calculateValuation() }}</template>
        </td>
        <td></td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
</style>
