<template>
  <div
    class="col pt-4 menu-card"
    :class="{ 'spinning': isHiding }"
  >
    <div class="card h-100">
      <img
        v-if="isHiding"
        src="../assets/retard-images/no-scope/bulletExplosion.png"
        class="bullet-explosion"
        alt="Explosion"
      />
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
              :disabled="getRestaurantIndex(menu.id) === store.state.restaurantOrder.length - 1"
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
            style="border-radius: 0px; background-color: var(--bs-soup-bg); border-color: var(--bs-soup-bg)"
          >
            <div class="row">
              <div class="col col-9">
                <span
                  :data-bs-toggle="soup.description.length == 0 ? '' : 'tooltip'"
                  data-bs-placement="top"
                  :data-bs-title="soup.description"
                >
                  {{ soup.name }}
                </span>
              </div>
              <div class="col col-3 text-end">{{ soup.price < 0 ? "---" : soup.price }} Kč</div>
            </div>
          </li>
          <li
            v-for="soup in menu.permanentmeals.filter((meal) => meal.isSoup)"
            :key="soup.name"
            class="list-group-item active"
            style="border-radius: 0px; background-color: var(--bs-soup-bg); border-color: var(--bs-soup-bg)"
          >
            <div class="row">
              <div class="col col-9">
                <span
                  :data-bs-toggle="soup.description.length == 0 ? '' : 'tooltip'"
                  data-bs-placement="top"
                  :data-bs-title="soup.description"
                >
                  {{ soup.name }}
                </span>
              </div>
              <div class="col col-3 text-end">{{ soup.price < 0 ? "---" : soup.price }} Kč</div>
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
                  :data-bs-toggle="meal.description.length == 0 ? '' : 'tooltip'"
                  data-bs-placement="top"
                  :data-bs-title="meal.description"
                >
                  {{ meal.name }}
                </span>
              </div>
              <div class="col col-3 text-end">{{ meal.price < 0 ? "---" : meal.price }} Kč</div>
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
                  :data-bs-toggle="meal.description.length == 0 ? '' : 'tooltip'"
                  data-bs-placement="top"
                  :data-bs-title="meal.description"
                >
                  {{ meal.name }}
                </span>
              </div>
              <div class="col col-3 text-end">{{ meal.price < 0 ? "---" : meal.price }} Kč</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as bootstrap from "bootstrap";
import { onMounted, onUpdated, ref } from "vue";
import { Direction, RestaurantDay } from "../types/Restaurant.ts";
import { useStore } from "vuex";
import { key } from "../store.ts";
import { BiSolidShow, BiSolidHide, BiLeftArrowAlt, BiRightArrowAlt } from "vue-icons-plus/bi";

const store = useStore(key);

defineProps<{
  menu: RestaurantDay;
  swapFunction: (id: number, direction: Direction) => void;
}>();
let tooltips: bootstrap.Tooltip[] = [];

const isHiding = ref(false);

const getRestaurantIndex = (id: number): number =>
  store.state.restaurantOrder.find((item) => item.id === id)?.index ?? 0;

const hideRestaurant = (id: number): void => {
  if (!store.state.retardMode) {
    store.commit("setRestaurantHidden", id);
    return;
  }

  store.commit("setAwpVisible", false);
  const corners = ["top-left", "top-right", "bottom-left", "bottom-right"];
  const randomCorner = corners[Math.floor(Math.random() * corners.length)];
  store.commit("setAwpCorner", randomCorner);
  setTimeout(() => {
    store.commit("setAwpVisible", true);
  }, 0);

  setTimeout(() => {
    isHiding.value = true;
    store.commit("setBackgroundFlashing", true);
    setTimeout(() => {
      store.commit("setRestaurantHidden", id);
      isHiding.value = false;
      setTimeout(() => {
        store.commit("setAwpVisible", false);
        store.commit("setBackgroundFlashing", false);
      }, 1000); // 1s wait + 0.5s spin + 1.0s spin back = 2.5s total
    }, 1000); // Wait for the spin animation to finish (0.5s)
  }, 1000); // Wait 1 second before starting the spin
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

.card.h-100 {
  position: relative;
}

.bullet-explosion {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200%;
  z-index: 10;
  pointer-events: none;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg) scale(1);
  }
  to {
    transform: rotate(360deg) scale(0);
  }
}
</style>
