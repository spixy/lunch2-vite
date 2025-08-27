export type Restaurant = {
    id: number
    restaurant: string
    url: string
    dailymenus: Menu[]
    permanentmeals: Meal[]
}

export type RestaurantDay = {
    id: number,
    restaurant: string
    url: string
    meals: Meal[]
    permanentmeals: Meal[]
}

export type Menu = {
    meals: Meal[]
    day: string
}

export type Meal = {
    name: string
    description: string
    isSoup: boolean
    price: number
}

export enum Direction {
    LEFT,
    RIGHT
}