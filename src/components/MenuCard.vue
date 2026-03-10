<template>
  <div class="col pt-4 menu-card">
    <div class="card h-100">
      <div class="card-header">
        <div class="row align-items-center p-2">
          <a
            class="col col-9 text-decoration-none text-reset"
            :href="menu.url"
          >
            {{ menu.restaurant }}
          </a>
          <div class="col col-1 p-0">
            <button
              class="btn w-100"
              style="padding: 0; border: none"
              :disabled="getRestaurantIndex(menu.id) === 0"
              @click="swapFunction(menu.id, Direction.LEFT)"
            >
              <BiLeftArrowAlt />
            </button>
          </div>
          <div class="col col-1 p-0">
            <button
              class="btn w-100"
              style="padding: 0; border: none"
              :disabled="
                getRestaurantIndex(menu.id) ===
                store.state.restaurantOrder.length - 1
              "
              @click="swapFunction(menu.id, Direction.RIGHT)"
            >
              <BiRightArrowAlt />
            </button>
          </div>
          <div class="col col-1 p-0">
            <button
              class="btn w-100 hide-toggle-btn"
              @click="hideRestaurant(menu.id)"
            >
              <BiSolidShow class="icon-show" />
              <BiSolidHide class="icon-hide" />
            </button>
          </div>
        </div>
      </div>
      <div
        class="card-body"
        style="padding: 0px"
      >
        <ul class="list-group">
          <li
            v-for="soup in menu.meals.filter((meal) => meal.isSoup)"
            :key="soup.name"
            class="list-group-item active"
            style="
              border-radius: 0px;
              background-color: var(--bs-soup-bg);
              border-color: var(--bs-soup-bg);
            "
          >
            <div class="row">
              <div class="col col-9">
                <span
                  :data-bs-toggle="
                    soup.description.length == 0 ? '' : 'tooltip'
                  "
                  data-bs-placement="top"
                  :data-bs-title="soup.description"
                >
                  {{ soup.name }}
                </span>
              </div>
              <div class="col col-3 text-end">
                {{ soup.price < 0 ? "---" : soup.price }} Kč
              </div>
            </div>
          </li>
          <li
            v-for="soup in menu.permanentmeals.filter((meal) => meal.isSoup)"
            :key="soup.name"
            class="list-group-item active"
            style="
              border-radius: 0px;
              background-color: var(--bs-soup-bg);
              border-color: var(--bs-soup-bg);
            "
          >
            <div class="row">
              <div class="col col-9">
                <span
                  :data-bs-toggle="
                    soup.description.length == 0 ? '' : 'tooltip'
                  "
                  data-bs-placement="top"
                  :data-bs-title="soup.description"
                >
                  {{ soup.name }}
                </span>
              </div>
              <div class="col col-3 text-end">
                {{ soup.price < 0 ? "---" : soup.price }} Kč
              </div>
            </div>
          </li>
          <li
            v-for="meal in menu.meals.filter((meal) => !meal.isSoup)"
            :key="meal.name"
            class="list-group-item"
            style="border-radius: 0px"
          >
            <div class="row">
              <div class="col col-9">
                <span
                  :data-bs-toggle="
                    meal.description.length == 0 ? '' : 'tooltip'
                  "
                  data-bs-placement="top"
                  :data-bs-title="meal.description"
                >
                  {{ meal.name }}
                </span>
              </div>
              <div class="col col-3 text-end">
                {{ meal.price < 0 ? "---" : meal.price }} Kč
              </div>
            </div>
          </li>
          <li
            v-for="meal in menu.permanentmeals.filter((meal) => !meal.isSoup)"
            :key="meal.name"
            class="list-group-item"
            style="border-radius: 0px"
          >
            <div class="row">
              <div class="col col-9">
                <span
                  :data-bs-toggle="
                    meal.description.length == 0 ? '' : 'tooltip'
                  "
                  data-bs-placement="top"
                  :data-bs-title="meal.description"
                >
                  {{ meal.name }}
                </span>
              </div>
              <div class="col col-3 text-end">
                {{ meal.price < 0 ? "---" : meal.price }} Kč
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as bootstrap from "bootstrap";
import { onMounted, onUpdated } from "vue";
import { Direction, RestaurantDay } from "../types/Restaurant.ts";
import { useStore } from "vuex";
import { key } from "../store.ts";
import {
  BiSolidShow,
  BiSolidHide,
  BiLeftArrowAlt,
  BiRightArrowAlt,
} from "vue-icons-plus/bi";

const store = useStore(key);

defineProps<{
  menu: RestaurantDay;
  swapFunction: (id: number, direction: Direction) => void;
}>();
let tooltips: bootstrap.Tooltip[] = [];

const getRestaurantIndex = (id: number): number =>
  store.state.restaurantOrder.find((item) => item.id === id)?.index ?? 0;

const hideRestaurant = (id: number): void => {
  store.commit("setRestaurantHidden", id);
};

onMounted(() => {
  [...document.querySelectorAll('[data-bs-toggle="tooltip"]')].forEach((el) =>
    tooltips.push(new bootstrap.Tooltip(el)),
  );
});

onUpdated(() => {
  tooltips.forEach((tooltip) => {
    tooltip.dispose();
  });
  tooltips = [];
  [...document.querySelectorAll('[data-bs-toggle="tooltip"]')].forEach((el) =>
    tooltips.push(new bootstrap.Tooltip(el)),
  );
});
</script>

<style scoped>
.hide-toggle-btn {
  padding: 0;
  border: none;
  opacity: 0.7;
}

.hide-toggle-btn .icon-hide {
  display: none;
}

.hide-toggle-btn:hover {
  opacity: 1;
}

.hide-toggle-btn:hover .icon-show {
  display: none;
}

.hide-toggle-btn:hover .icon-hide {
  display: inline-block;
}
</style>
