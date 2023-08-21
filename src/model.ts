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
export interface Property {
    readonly name: string
    readonly price: number
    readonly cost: number
    readonly group: Group

    canBuildHouse(): boolean
}

// 土地
export class Street implements Property {
    static readonly HACHIOJI: Street = new Street('八王子', 60, 50, Group.BROWN)
    static readonly TACHIKAWA: Street = new Street('立川', 60, 50, Group.BROWN)
    static readonly YOTSUYA: Street = new Street('四ツ谷', 100, 50, Group.LIGHTBLUE)
    static readonly YOYOGI: Street = new Street('代々木', 100, 50, Group.LIGHTBLUE)
    static readonly ICHIGAYA: Street = new Street('市ヶ谷', 120, 50, Group.LIGHTBLUE)
    static readonly AKIHABARA: Street = new Street('秋葉原', 140, 100, Group.LIGHTPURPLE)
    static readonly UENO: Street = new Street('上野', 140, 100, Group.LIGHTPURPLE)
    static readonly IKEBUKURO: Street = new Street('池袋', 160, 100, Group.LIGHTPURPLE)
    static readonly ODAIBA: Street = new Street('お台場', 180, 100, Group.ORANGE)
    static readonly HIBIYA: Street = new Street('日比谷', 180, 100, Group.ORANGE)
    static readonly SHIMBASHI: Street = new Street('新橋', 200, 100, Group.ORANGE)
    static readonly EBISU: Street = new Street('恵比寿', 220, 150, Group.RED)
    static readonly HARAJUKU: Street = new Street('原宿', 220, 150, Group.RED)
    static readonly OMOTESANDO: Street = new Street('表参道', 240, 150, Group.RED)
    static readonly AKASAKA: Street = new Street('赤坂', 260, 150, Group.YELLOW)
    static readonly ROPPONGI: Street = new Street('六本木', 260, 150, Group.YELLOW)
    static readonly TORANOMON: Street = new Street('虎ノ門', 280, 150, Group.YELLOW)
    static readonly YURAKUCHO: Street = new Street('有楽町', 300, 200, Group.GREEN)
    static readonly NIHONBASHI: Street = new Street('日本橋', 300, 200, Group.GREEN)
    static readonly OTEMACHI: Street = new Street('大手町', 320, 200, Group.GREEN)
    static readonly MARUNOUCHI: Street = new Street('丸ノ内', 350, 200, Group.DARKBLUE)
    static readonly GINZA: Street = new Street('銀座', 400, 200, Group.DARKBLUE)

    readonly name: string
    readonly price: number
    readonly cost: number
    readonly group: Group

    private constructor(name: string, price: number, cost: number, group: Group) {
        this.name = name
        this.price = price
        this.cost = cost
        this.group = group
    }

    canBuildHouse(): boolean {
        return true
    }
}

// 鉄道
export class Railroad implements Property {
    static readonly SHINJUKU: Railroad = new Railroad('新宿駅', 200, Group.RAILROAD)
    static readonly SHINAGAWA: Railroad = new Railroad('品川駅', 200, Group.RAILROAD)
    static readonly SHIBUYA: Railroad = new Railroad('渋谷駅', 200, Group.RAILROAD)
    static readonly TOKYO: Railroad = new Railroad('東京駅', 200, Group.RAILROAD)

    readonly name: string
    readonly price: number
    readonly cost: number
    readonly group: Group

    private constructor(name: string, price: number, group: Group) {
        this.name = name
        this.price = price
        this.cost = 0
        this.group = group
    }

    canBuildHouse(): boolean {
        return false
    }
}

// 公共会社
export class Utility implements Property {
    static readonly POWER_COMPANY: Utility = new Utility('電力会社', 150, Group.UTILITY)
    static readonly WATER_COMPANY: Utility = new Utility('水道会社', 150, Group.UTILITY)

    readonly name: string
    readonly price: number
    readonly cost: number
    readonly group: Group

    private constructor(name: string, price: number, group: Group) {
        this.name = name
        this.price = price
        this.cost = 0
        this.group = group
    }

    canBuildHouse(): boolean {
        return false
    }
}

class PropertyStatus {
    readonly property: Property
    houseCount: number
    mortgaged: boolean

    constructor(property: Property) {
        this.property = property
        this.houseCount = 0
        this.mortgaged = false
    }
}

// プレイヤー
export class Player {
    name: string
    money: number
    private propertyStatuses: Map<string, PropertyStatus>

    constructor()

    constructor(name?: string) {
        // TODO デフォルトプレイヤー名の設定
        this.name = name ?? 'プレイヤー'
        this.money = 0
        this.propertyStatuses = new Map()
    }

    // 部件を保持しているか
    hasProperty(property: Property): boolean {
        return this.propertyStatuses.has(property.name)
    }

    // 物件購入
    buyProperty(property: Property): void {
        if (this.propertyStatuses.has(property.name)) {
            throw new Error()
        }
        this.propertyStatuses.set(property.name, new PropertyStatus(property))
    }

    // 物件売却
    sellProperty(property: Property): void {
        if (!this.propertyStatuses.has(property.name)) {
            throw new Error()
        }
        this.propertyStatuses.delete(property.name)
    }

    // 抵当設定
    mortgageProperty(property: Property): void {
        if (!this.propertyStatuses.has(property.name)) {
            throw new Error()
        }
        this.propertyStatuses.get(property.name)!.mortgaged = true
    }

    // 抵当解除
    settlementProperty(property: Property): void {
        if (!this.propertyStatuses.has(property.name)) {
            throw new Error()
        }
        this.propertyStatuses.get(property.name)!.mortgaged = false
    }

    // 家を建てる
    buildHouses(property: Property, count?: number): void {
        this.addHouseCount(property, count ?? 1)
    }

    // 家を売る
    sellHouses(property: Property, count: number): void {
        this.addHouseCount(property, -(count ?? 1))
    }

    // 家を追加する
    private addHouseCount(property: Property, count: number) {
        if (!property.canBuildHouse()) {
            throw new Error()
        }
        if (!this.propertyStatuses.has(property.name)) {
            throw new Error()
        }
        const status: PropertyStatus = this.propertyStatuses.get(property.name)!

        const afterHouseCount: number = status.houseCount + count
        if (afterHouseCount < 0 || afterHouseCount > 5) {
            throw new Error()
        }
        status.houseCount = afterHouseCount
    }

    // 家を全て売る
    sellAllHouses(property: Property): void {
        // TODO 未実装
    }

    // ホテルを建てる
    buildHotel(property: Property): void {
        // TODO 未実装
    }

    // ホテルを売る
    sellHotel(property: Property): void {
        // TODO 未実装
    }

    // 評価額を算出する
    calculatePresentValue(property: Property): number {
        if (!this.propertyStatuses.has(property.name)) {
            throw new Error()
        }
        const status: PropertyStatus = this.propertyStatuses.get(property.name)!

        return status.property.price / (status.mortgaged ? 2 : 1) + status.property.cost * status.houseCount
    }
}
