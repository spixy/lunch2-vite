<template>
  <RetardBackground />
  <div
    id="lunchinator"
    class="pt-4"
  >
    <h1
      class="text-center"
      :class="{ 'retard-bounce': store.state.retardMode }"
    >
      <marquee
        v-if="store.state.retardMode"
        behavior="alternate"
        scrollamount="20"
      >
        {{ title }}
      </marquee>
      <template v-else>
        {{ title }}
      </template>
    </h1>
  </div>
  <div class="p-4">
    <div class="row">
      <div class="col col-11">
        <DaySelection
          :selected="selectedDay"
          :update-func="getRestaurantsForDay"
        />
      </div>
      <div class="col col-2 col-md-1">
        <ThemeSelector />
        <RetardSelector />
      </div>
    </div>
    <Draggable
      v-model="menus"
      v-bind="dragOptions"
      @start="drag = true"
      @end="onDragEnd"
    >
      <template #item="{ element }">
        <MenuCard
          :menu="element"
          :swap-function="swapRestaurants"
        />
      </template>
    </Draggable>
  </div>
</template>

<script setup lang="ts">
import { Ref, onMounted, ref, computed } from "vue";
import DaySelection from "./components/DaySelection.vue";
import MenuCard from "./components/MenuCard.vue";
import { Direction, Restaurant, RestaurantDay } from "./types/Restaurant";
import { restaurantToRestaurantDay } from "./services/restaurantServices";
import ThemeSelector from "./components/ThemeSelector.vue";
import { useStore } from "vuex";
import { key } from "./store";
import RetardSelector from "./components/RetardSelector.vue";
import RetardBackground from "./components/RetardBackground.vue";
import Draggable from "vuedraggable";

const titles = [
  "Hop Hop",
  "Pomáhame si",
  "bum bum to dělá",
  "Teď se du vysrat, ale pořádne",
  "tady je bubak ty ho nevidiš ale ja jo",
  "- To jsou písmenka nebo čísla?",
  "- To je kubatura, ale nevím co to je",
  "- To udělali vaši lidi",
  "Žádám aby to bylo řádně vyšetřeno",
  "Zabiju se",
  "Já mu trefim",
  "a pivko na pni",
  "televizia Markíza uvádzá {title}",
  "V O L H A",
  "- Pomoc",
];
const menus: Ref<RestaurantDay[]> = ref([]);
const selectedDay: Ref<number> = ref(new Date().getDay());
const days = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];
const baseUrl = import.meta.env.VITE_API_URL;
const drag = ref(false);
const dragOptions = computed(() => {
  return {
    class: "row equal row-cols-1 justify-content-center",
    animation: 200,
    group: "description",
    disabled: false,
    ghostClass: "ghost",
    itemKey: "id",
    componentData: {
      tag: "ul",
      type: "transition-group",
      name: !drag.value ? "flip-list" : null,
    },
  };
});

const store = useStore(key);

const title = computed(() => {
  const currentTitle = titles[Math.floor(Math.random() * titles.length)];
  if (currentTitle.includes("{title}")) {
    return currentTitle.replace("{title}", "Lunchinator");
  }
  return "Lunchinator " + currentTitle;
});

onMounted(() => {
  //document.querySelector("html")!.setAttribute('data-bs-theme', 'light');
  document.body.setAttribute(
    "data-bs-theme",
    store.state.darkTheme ? "dark" : "light",
  );
});

const swapRestaurants = (id: number, direction: Direction) => {
  const oldIndex = store.state.restaurantOrder.get(id);
  if (oldIndex === undefined || oldIndex === null) {
    return;
  }

  const newIndex = oldIndex + (direction == Direction.LEFT ? -1 : 1);
  if (newIndex < 0 || newIndex >= menus.value.length) {
    return;
  }

  let swapId = -1;
  for (const [key, value] of store.state.restaurantOrder.entries()) {
    if (value === newIndex) {
      swapId = key;
      break;
    }
  }
  const tmpRestaurant = menus.value[newIndex];
  menus.value[newIndex] = menus.value[oldIndex];
  menus.value[oldIndex] = tmpRestaurant;
  store.commit("updateRestaurantOrder", { id, newIndex, oldIndex, swapId });
};

const updateRestaurantOrder = (restaurants: Restaurant[]) => {
  const restaurantOrder = new Map(store.state.restaurantOrder);
  for (const restaurant of restaurants) {
    if (!restaurantOrder.has(restaurant.id)) {
      restaurantOrder.set(restaurant.id, restaurantOrder.size);
    }
  }
  // TODO check if works?
  for (const [key, value] of restaurantOrder.entries()) {
    if (restaurants.filter((res) => res.id == key).length === 0) {
      restaurantOrder.delete(key);
      for (const [key2, value2] of restaurantOrder.entries()) {
        if (value2 >= value) {
          restaurantOrder.set(key2, value2 - 1);
        }
      }
    }
  }
  store.commit("setRestaurantOrder", restaurantOrder);
};

const sortRestaurantDays = (restaurants: RestaurantDay[]): RestaurantDay[] => {
  const result = new Array<RestaurantDay>(restaurants.length);
  for (const restaurant of restaurants) {
    result[store.state.restaurantOrder.get(restaurant.id) ?? 0] = restaurant;
  }
  return result;
};

const getRestaurantsForDay = async (day: number) => {
  selectedDay.value = day;
  const response: Restaurant[] = await fetch(
    `${baseUrl}/get?day=${days[day]}`,
  ).then((response) => response.json());
  updateRestaurantOrder(response);
  menus.value = sortRestaurantDays(restaurantToRestaurantDay(response));
};

getRestaurantsForDay(selectedDay.value);

const onDragEnd = () => {
  drag.value = false;
  const newRestaurantMap = new Map(
    menus.value.map(({ id }, index) => [id, index]),
  );
  store.commit("setRestaurantOrder", newRestaurantMap);
};
</script>

<style scoped>
.retard-bounce {
  animation: retard-bounce 0.5s infinite linear;
  display: block;
}

@keyframes retard-bounce {
  0% {
    transform: translateY(0) rotate(0deg) scale(1);
    color: #ff0000;
  }
  25% {
    color: #ffff00;
    transform: translateY(-10px) rotate(-5deg) scale(1.1);
  }
  50% {
    color: #00ff00;
    transform: translateY(-20px) rotate(5deg) scale(1.2);
    text-shadow:
      2px 2px 10px #ff00ff,
      -2px -2px 10px #00ffff;
  }
  75% {
    color: #00ffff;
    transform: translateY(-10px) rotate(-5deg) scale(1.1);
  }
  100% {
    transform: translateY(0) rotate(0deg) scale(1);
    color: #0000ff;
  }
}
</style>

<style lang="scss">
@import "./assets/scss/style.scss";
</style>
