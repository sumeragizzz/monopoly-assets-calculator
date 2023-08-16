// カラーグループ
export class ColorGroup {
    static readonly BROWN = new ColorGroup('ブラウン', 2)
    static readonly LIGHTBLUE = new ColorGroup('ライトブルー', 3)
    static readonly LIGHTPURPLE = new ColorGroup('ライトパープル', 3)
    static readonly ORANGE = new ColorGroup('オレンジ', 3)
    static readonly RED = new ColorGroup('レッド', 3)
    static readonly YELLOW = new ColorGroup('イエロー', 3)
    static readonly GREEN = new ColorGroup('グリーン', 3)
    static readonly DARKBLUE = new ColorGroup('ダークブルー', 2)
    readonly name: string
    readonly streetCount: number
    constructor(name: string, streetCount: number) {
        this.name = name
        this.streetCount = streetCount
    }
}

// 土地
export interface Place {
    readonly name: string
    readonly price: number
}

// 土地
export class Street implements Place {
    static readonly HIBIYA: Street = new Street('日比谷', 180, 100, ColorGroup.ORANGE)
    // TODO
    readonly name: string
    readonly price: number
    readonly cost: number
    readonly colorGroup: ColorGroup
    constructor(name: string, price: number, cost: number, colorGroup: ColorGroup) {
        this.name = name
        this.price = price
        this.cost = cost
        this.colorGroup = colorGroup
    }
}

// 鉄道
export class Railroad implements Place {
    static readonly SHINJUKU: Railroad = new Railroad('新宿駅', 200)
    static readonly SHINAGAWA: Railroad = new Railroad('品川駅', 200)
    static readonly SHIBUYA: Railroad = new Railroad('渋谷駅', 200)
    static readonly TOKYO: Railroad = new Railroad('東京駅', 200)
    readonly name: string
    readonly price: number
    constructor(name: string, price: number) {
        this.name = name
        this.price = price
    }
}

// 公共会社
export class Utilities implements Place {
    static readonly POWER_COMPANY: Utilities = new Utilities('電力会社', 150)
    static readonly WATER_COMPANY: Utilities = new Utilities('水道会社', 150)
    readonly name: string
    readonly price: number
    constructor(name: string, price: number) {
        this.name = name
        this.price = price
    }
}

export class StreetStatus {
    readonly street: Street
    mortgaged: boolean
    houseCount: number
    hotel: boolean
    constructor(street: Street) {
        this.street = street
        this.mortgaged = false
        this.houseCount = 0
        this.hotel = false
    }
}

export class PlaceStatus {
    readonly place: Place
    mortgaged: boolean
    properties: boolean
    constructor(place: Place) {
        this.place = place
        this.mortgaged = false
        this.properties = false
    }
}

// プレイヤー
export class Player {
    name: string
    money: number
    streetStatuses: Array<StreetStatus>
    placeStatuses: Array<PlaceStatus>
    constructor()
    constructor(name?: string) {
        // TODO デフォルトプレイヤー名の設定
        this.name = name ?? 'プレイヤー'
        this.money = 0
        this.streetStatuses = []
        this.placeStatuses = []
    }
}
