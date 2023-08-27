import { Meal, Restaurant, RestaurantDay } from "../types/Restaurant"

const noDataMeals: Meal[] = [
    {
        name: "No Data",
        description: "The selected restaurant has no data for this day",
        isSoup: false,
        price: -1
    }
]

export const restaurantToRestaurantDay = (data: Restaurant[]): RestaurantDay[]  => {
    const result = [];
    for(const restaurant of data) {
        result.push({
            id: restaurant.id,
            restaurant: restaurant.restaurant,
            meals: restaurant.dailymenus[0].meals.length == 0 && restaurant.permanentmeals.length == 0 ? noDataMeals : restaurant.dailymenus[0].meals,
            permanentmeals: restaurant.permanentmeals ?? [],
        });
    }
    return result;
}