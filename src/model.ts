// グループ
export class Group {
    // カラーグループ
    static readonly BROWN = new Group('ブラウン', 2, 'brown')
    static readonly LIGHTBLUE = new Group('ライトブルー', 3, 'lightblue')
    static readonly LIGHTPURPLE = new Group('ライトパープル', 3, 'purple')
    static readonly ORANGE = new Group('オレンジ', 3, 'orange')
    static readonly RED = new Group('レッド', 3, 'red')
    static readonly YELLOW = new Group('イエロー', 3, 'yellow')
    static readonly GREEN = new Group('グリーン', 3, 'green')
    static readonly DARKBLUE = new Group('ダークブルー', 2, 'darkblue')

    // 鉄道
    static readonly RAILROAD = new Group('鉄道', 4, 'black')

    // 公共会社
    static readonly UTILITY = new Group('公共会社', 2, 'grey')

    readonly name: string
    readonly streetCount: number
    readonly color: string

    private constructor(name: string, streetCount: number, color: string) {
        this.name = name
        this.streetCount = streetCount
        this.color = color
    }
}

// 物件
export class Property {
    // 土地
    static readonly HACHIOJI: Property = new Property('八王子', 60, 50, Group.BROWN, true)
    static readonly TACHIKAWA: Property = new Property('立川', 60, 50, Group.BROWN, true)
    static readonly YOTSUYA: Property = new Property('四ツ谷', 100, 50, Group.LIGHTBLUE, true)
    static readonly YOYOGI: Property = new Property('代々木', 100, 50, Group.LIGHTBLUE, true)
    static readonly ICHIGAYA: Property = new Property('市ヶ谷', 120, 50, Group.LIGHTBLUE, true)
    static readonly AKIHABARA: Property = new Property('秋葉原', 140, 100, Group.LIGHTPURPLE, true)
    static readonly UENO: Property = new Property('上野', 140, 100, Group.LIGHTPURPLE, true)
    static readonly IKEBUKURO: Property = new Property('池袋', 160, 100, Group.LIGHTPURPLE, true)
    static readonly ODAIBA: Property = new Property('お台場', 180, 100, Group.ORANGE, true)
    static readonly HIBIYA: Property = new Property('日比谷', 180, 100, Group.ORANGE, true)
    static readonly SHIMBASHI: Property = new Property('新橋', 200, 100, Group.ORANGE, true)
    static readonly EBISU: Property = new Property('恵比寿', 220, 150, Group.RED, true)
    static readonly HARAJUKU: Property = new Property('原宿', 220, 150, Group.RED, true)
    static readonly OMOTESANDO: Property = new Property('表参道', 240, 150, Group.RED, true)
    static readonly AKASAKA: Property = new Property('赤坂', 260, 150, Group.YELLOW, true)
    static readonly ROPPONGI: Property = new Property('六本木', 260, 150, Group.YELLOW, true)
    static readonly TORANOMON: Property = new Property('虎ノ門', 280, 150, Group.YELLOW, true)
    static readonly YURAKUCHO: Property = new Property('有楽町', 300, 200, Group.GREEN, true)
    static readonly NIHONBASHI: Property = new Property('日本橋', 300, 200, Group.GREEN, true)
    static readonly OTEMACHI: Property = new Property('大手町', 320, 200, Group.GREEN, true)
    static readonly MARUNOUCHI: Property = new Property('丸ノ内', 350, 200, Group.DARKBLUE, true)
    static readonly GINZA: Property = new Property('銀座', 400, 200, Group.DARKBLUE, true)

    // 鉄道
    static readonly SHINJUKU: Property = new Property('新宿駅', 200, 0, Group.RAILROAD, false)
    static readonly SHINAGAWA: Property = new Property('品川駅', 200, 0, Group.RAILROAD, false)
    static readonly SHIBUYA: Property = new Property('渋谷駅', 200, 0, Group.RAILROAD, false)
    static readonly TOKYO: Property = new Property('東京駅', 200, 0, Group.RAILROAD, false)

    // 公共会社
    static readonly POWER_COMPANY: Property = new Property('電力会社', 150, 0, Group.UTILITY, false)
    static readonly WATER_COMPANY: Property = new Property('水道会社', 150, 0, Group.UTILITY, false)

    readonly name: string
    readonly price: number
    readonly cost: number
    readonly group: Group
    readonly buildable: boolean

    private constructor(name: string, price: number, cost: number, group: Group, buildable: boolean) {
        this.name = name
        this.price = price
        this.cost = cost
        this.group = group
        this.buildable = buildable
    }
}

// 物件状態
class PropertyStatus {
    readonly property: Property
    owner?: Player
    houseCount: number
    mortgaged: boolean

    constructor(property: Property) {
        this.property = property
        this.owner = undefined
        this.houseCount = 0
        this.mortgaged = false
    }

    isOwned(player?: Player): boolean {
        if (player === undefined) {
            return this.owner !== undefined
        }
        return this.owner === player
    }

    dennyProperty() {
        this.owner = undefined
    }

    calculateValuation(): number {
        if (!this.isOwned()) {
            return 0
        }
        if (this.mortgaged) {
            return this.property.price / 2
        }
        return this.property.price + this.property.cost * this.houseCount
    }
}

export class Game {
    private board: Board
    private  players: Array<Player>

    constructor() {
        this.board = new Board()
        this.players = new Array(new Player(this.board))
    }

	getAllProperties(): Array<Property> {
        return Array.from(Board.properties)
    }

    getPropertyStatus(property: Property): PropertyStatus {
        return this.board.getPropertyStatus(property)
    }

	addPlayer(): Player | undefined {
        if (this.players.length >= 8) {
            return undefined
        }
        const newPlayer: Player = new Player(this.board);
        this.players.push(newPlayer)
        return newPlayer
    }

    removePlayer(id: string): Player | undefined {
        if (this.players.length <= 1) {
            return undefined
        }

        const playerIndex: number = this.players.findIndex(player => player.id === id)
        const player: Player = this.players[playerIndex]

        Board.properties
            .map(property => this.board.getPropertyStatus(property))
            .filter(status => status.isOwned(player))
            .forEach(status => status.dennyProperty())

        this.players.splice(playerIndex, 1)
        return player
    }

    getPlayer(id: string): Player | undefined {
        return this.players.find(player => player.id === id)
    }

    getOwnedPlayer(property: Property): Player | undefined {
        return this.board.getPropertyStatus(property).owner
    }

    getAllPlayers(): Array<Player> {
        return Array.from(this.players)
    }
}

class Board {
    static readonly properties: Array<Property> = [
        Property.HACHIOJI, Property.TACHIKAWA,
        Property.YOTSUYA, Property.YOYOGI, Property.ICHIGAYA,
        Property.AKIHABARA, Property.UENO, Property.IKEBUKURO,
        Property.ODAIBA, Property.HIBIYA, Property.SHIMBASHI,
        Property.EBISU, Property.HARAJUKU, Property.OMOTESANDO,
        Property.AKASAKA, Property.ROPPONGI, Property.TORANOMON,
        Property.YURAKUCHO, Property.NIHONBASHI, Property.OTEMACHI,
        Property.MARUNOUCHI, Property.GINZA,
        Property.SHINJUKU, Property.SHINAGAWA, Property.SHIBUYA, Property.TOKYO,
        Property.POWER_COMPANY, Property.WATER_COMPANY
    ]

    private statuses: Map<Property, PropertyStatus>

    constructor() {
        this.statuses = new Map(Board.properties.map(property => [property, new PropertyStatus(property)]))
    }

    getPropertyStatus(property: Property): PropertyStatus {
        return this.statuses.get(property)!
    }
}

// プレイヤー
export class Player {
    private board: Board
    readonly id: string
    name: string
    money: number

    constructor(board: Board)

    constructor(board: Board, name?: string) {        
        this.board = board
        this.id = crypto.randomUUID()
        this.name = name ?? 'プレイヤー'
        this.money = 0
    }

    buyProperty(property: Property, houseCount: number): void {
        const status: PropertyStatus = this.board.getPropertyStatus(property)
        status.owner = this
        status.houseCount = houseCount
        status.mortgaged = false
    }

    sellProperty(property: Property): void {
        const status: PropertyStatus = this.board.getPropertyStatus(property)
        status.owner = undefined
        status.houseCount = 0
        status.mortgaged = false
    }

    mortgageProperty(property: Property): void {
        const status: PropertyStatus = this.board.getPropertyStatus(property)
        status.owner = this
        status.houseCount = 0
        status.mortgaged = true
    }

    settlementProperty(property: Property): void {
        const status: PropertyStatus = this.board.getPropertyStatus(property)
        status.mortgaged = false
    }

    calculateTotalValuation(): number {
        return Board.properties
            .map(property => this.board.getPropertyStatus(property))
            .filter(status => status.owner !== undefined && status.owner.id === this.id)
            .map(status => status.calculateValuation())
            .reduce((previousValue, currentValue) => previousValue + currentValue, 0)
    }

    isOwnedProperty(property: Property): boolean {
        return this.board.getPropertyStatus(property).owner === this
    }
}
