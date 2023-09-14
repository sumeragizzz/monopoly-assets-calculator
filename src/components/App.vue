<script setup lang="ts">
import { ref } from 'vue'
import { Game, Player, Property } from '../js/model.ts'

defineProps<{ msg: string }>()

const game = ref(new Game())

const addPlayer = () => {
  game.value.addPlayer()
}

const removePlayer = (player: Player, playerIndex: number) => {
  if (confirm(`${playerIndex + 1}: ${player.name}を削除してもよろしいですか？`)) {
    game.value.removePlayer(player.id)
  }
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

const isActivatedSellButton = (property: Property) => {
  return !game.value.getPropertyStatus(property).isOwned()
}

const isActivatedBuyButton = (property: Property, houseCount: number) => {
  const owned: boolean = game.value.getPropertyStatus(property).isOwned()
  const currentHouseCount: number = game.value.getPropertyStatus(property).houseCount
  const mortgaged: boolean = game.value.getPropertyStatus(property).mortgaged
  return owned && houseCount === currentHouseCount && !mortgaged
}

const isActivatedMortgageButton = (property: Property) => {
  const owned: boolean = game.value.getPropertyStatus(property).isOwned()
  const mortgaged = game.value.getPropertyStatus(property).mortgaged
  return owned && mortgaged
}
</script>

<template>
  <div class="container">
    <h1>モノポリー資産計算機</h1>
  </div>

  <div class="container-fluid">
  <table class="table table-sm table-striped">
    <thead>
      <tr>
        <th colspan="5"></th>
        <th>
          プレイヤー
          <button @click="addPlayer" :disabled="game.getAllPlayers().length >= 8" class="btn btn-sm btn-primary">追加</button>
        </th>
        <td v-for="(player, playerIndex) in game.getAllPlayers()">
          <div class="input-group">
            <span class="input-group-text">{{ playerIndex + 1 }}</span>
            <input type="text" v-model="player.name" :id="`playerName${playerIndex}`" title="プレイヤー" class="form-control form-control-sm" />
            <button @click="removePlayer(player, playerIndex)" :disabled="game.getAllPlayers().length <= 1" class="btn btn-sm btn-danger">削除</button>
          </div>
        </td>
      </tr>
      <tr>
        <th colspan="5"></th>
        <th>合計</th>
        <!-- <td v-for="player in game.getAllPlayers()">{{ player.money + player.calculateTotalValuation() }}</td> -->
        <td v-for="(player, playerIndex) in game.getAllPlayers()">
          <input type="number" :value="player.calculateTotalAssets()" readonly :id="`playerTotalAssets${playerIndex}`" title="合計" class="form-control form-control-sm text-end bg-secondary-subtle" />
        </td>
      </tr>
      <tr>
        <th colspan="5"></th>
        <th>所持金</th>
        <td v-for="(player, playerIndex) in game.getAllPlayers()">
          <input type="number" v-model.number="player.money" :id="`playerMoney${playerIndex}`" title="所持金" class="form-control form-control-sm text-end" />
        </td>
      </tr>
      <tr>
        <th><!--カラーグループ--></th>
        <th>物件</th>
        <th>価格</th>
        <th>建設費</th>
        <th>操作</th>
        <th>所有者</th>
        <th v-for="(player, playerIndex) in game.getAllPlayers()">
          <input type="number" :value="player.calculateTotalValuation()" readonly :id="`playerTotalValuation${playerIndex}`" title="物件価値合計" class="form-control form-control-sm text-end bg-secondary-subtle" />
        </th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="(property, propertyIndex) in game.getAllProperties()">
        <td :style="{'background-color': property.group.color}"></td>
        <td>{{ property.name }}</td>
        <td class="text-end">{{ property.price }}</td>
        <td class="text-end">{{ !property.buildable ? '-' : property.cost }}</td>
        <td>
          <button @click="sellProperty(property)" class="btn btn-sm" :class="{'btn-secondary': isActivatedSellButton(property), 'btn-outline-secondary': !isActivatedSellButton(property)}">✕</button>
          <div class="btn-group">
            <button @click="buyProperty(property, 0)" class="btn btn-sm" :class="{'btn-success': isActivatedBuyButton(property, 0), 'btn-outline-success': !isActivatedBuyButton(property, 0)}">0</button>
            <button @click="buyProperty(property, 1)" :disabled="!property.buildable" class="btn btn-sm" :class="{'btn-success': isActivatedBuyButton(property, 1), 'btn-outline-success': !isActivatedBuyButton(property, 1)}">1</button>
            <button @click="buyProperty(property, 2)" :disabled="!property.buildable" class="btn btn-sm" :class="{'btn-success': isActivatedBuyButton(property, 2), 'btn-outline-success': !isActivatedBuyButton(property, 2)}">2</button>
            <button @click="buyProperty(property, 3)" :disabled="!property.buildable" class="btn btn-sm" :class="{'btn-success': isActivatedBuyButton(property, 3), 'btn-outline-success': !isActivatedBuyButton(property, 3)}">3</button>
            <button @click="buyProperty(property, 4)" :disabled="!property.buildable" class="btn btn-sm" :class="{'btn-success': isActivatedBuyButton(property, 4), 'btn-outline-success': !isActivatedBuyButton(property, 4)}">4</button>
          </div>
          <button @click="buyProperty(property, 5)" :disabled="!property.buildable" class="btn btn-sm" :class="{'btn-danger': isActivatedBuyButton(property, 5), 'btn-outline-danger': !isActivatedBuyButton(property, 5)}">ホテル</button>
          <button @click="mortgageProperty(property)" class="btn btn-sm" :class="{'btn-warning': isActivatedMortgageButton(property), 'btn-outline-warning': !isActivatedMortgageButton(property)}">抵当</button>
        </td>
        <td>
          <select v-model="game.getPropertyStatus(property).owner" :id="`propertyOwner${propertyIndex}`" title="所有者" class="form-select-sm">
            <option disabled>所有者を選択してください</option>
            <option :value="undefined"></option>
            <option v-for="(player, playerIndex) in game.getAllPlayers()" :value="player">{{ `${playerIndex + 1}: ${player.name}` }}</option>
          </select>
        </td>
        <td v-for="player in game.getAllPlayers()" class="text-end">
          <template v-if="player.isOwnedProperty(property)">{{ game.getPropertyStatus(property).calculateValuation() }}</template>
        </td>
      </tr>
    </tbody>
  </table>
  </div>
</template>

<style scoped>
</style>
