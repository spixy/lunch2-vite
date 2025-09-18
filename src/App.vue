<template>
    <div id="lunchinator" class="pt-4">
        <h1 class="text-center">{{ title }}</h1>
    </div>
    <div class="container p-4">
        <div class="row">
            <div class="col col-11">
                <DaySelection :selected=selectedDay :update-func="getRestaurantsForDay" />
            </div>
            <div class="col col-2 col-md-1">
                <ThemeSelector />
            </div>
        </div>
        <div class="row equal row-cols-1 row-cols-md-2 row-cols-lg-2 row-cols-xl-3">
            <Menu v-for="menu in menus" :menu=menu :swapFunction=swapRestaurants />
        </div>
    </div>
</template>

<script setup lang="ts">
import { Ref, onMounted, ref } from 'vue';
import DaySelection from './components/DaySelection.vue'
import Menu from './components/Menu.vue'
import { Direction, Restaurant, RestaurantDay } from './types/Restaurant';
import { restaurantToRestaurantDay } from './services/restaurantServices';
import ThemeSelector from './components/ThemeSelector.vue';
import { useStore } from 'vuex';
import { key } from './store';

const titles = [
    'Hop Hop',
    'Pomáhame si',
    'bum bum to dělá',
    'Teď jse du vysrat, ale pořádne',
    'tady je bubak ty ho nevidiš ale ja jo',
    '- To jsou písmenka nebo čísla?',
    '- To je kubatura, ale nevím co to je',
    '- To udělali vaši lidi',
    'Žádám aby to bylo řádně vyšetřeno',
    'Zabiju se',
];
const menus: Ref<RestaurantDay[]> = ref([]);
const selectedDay: Ref<number> = ref(new Date().getDay());
const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const baseUrl = 'http://localhost:8080'; //import.meta.env.VITE_API_URL;

const title = 'Lunchinator ' + titles[Math.floor(Math.random() * titles.length)];

const swapRestaurants = (id: number, direction: Direction) => {
    const oldIndex = store.state.restaurantOrder.get(id);
    if (oldIndex === undefined || oldIndex === null) {
        return;
    }

    const newIndex = oldIndex + (direction == Direction.LEFT ? -1 : 1);
    if(newIndex < 0 || newIndex >= menus.value.length) {
        return;
    }

    let swapId = -1;
    for (let [key, value] of store.state.restaurantOrder.entries()) {
        if (value === newIndex) {
            swapId = key;
            break;
        }
    }
    const tmpRestaurant = menus.value[newIndex];
    menus.value[newIndex] = menus.value[oldIndex];
    menus.value[oldIndex] = tmpRestaurant;
    store.commit("updateRestaurantOrder", { id, newIndex, oldIndex, swapId });
}

const updateRestaurantOrder = (restaurants: Restaurant[]) => {
    const restaurantOrder = new Map(store.state.restaurantOrder);
    for (const restaurant of restaurants) {
        if (!restaurantOrder.has(restaurant.id)) {
            restaurantOrder.set(restaurant.id, restaurantOrder.size);
        }
    }
    // TODO check if works?
    for (const [key, value] of restaurantOrder.entries()) {
        if (restaurants.filter(res => res.id == key).length === 0) {
            restaurantOrder.delete(key);
            for (const [key2, value2] of restaurantOrder.entries()) {
                if (value2 >= value) {
                    restaurantOrder.set(key2, value2 - 1);
                }
            }
        }
    }
    store.commit("setRestaurantOrder", restaurantOrder);
}

const sortRestaurantDays = (restaurants: RestaurantDay[]): RestaurantDay[] => {
    const result = new Array<RestaurantDay>(restaurants.length);
    for (const restaurant of restaurants) {
        result[store.state.restaurantOrder.get(restaurant.id) ?? 0] = restaurant;
    }
    return result;
}

const getRestaurantsForDay = async (day: number) => {
    selectedDay.value = day;
    const response: Restaurant[] = await fetch(`${baseUrl}/get?day=${days[day]}`)
        .then(response => response.json());
    updateRestaurantOrder(response);
    menus.value = sortRestaurantDays(restaurantToRestaurantDay(response));
}

getRestaurantsForDay(selectedDay.value);
const store = useStore(key);

onMounted(() => {
    //document.querySelector("html")!.setAttribute('data-bs-theme', 'light');
    document.body.setAttribute('data-bs-theme', store.state.darkTheme ? 'dark' : 'light');
})
</script>

<style scoped>
.logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
}

.logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

<style lang="scss">
@import "./assets/scss/style.scss"
</style>