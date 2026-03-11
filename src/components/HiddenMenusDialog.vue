<template>
  <div>
    <button
      type="button"
      :class="hideButtonClass"
      @click="showHiddenModal = true"
    >
      Hidden ({{ hiddenRestaurants.length }})
    </button>
    <div
      v-if="showHiddenModal"
      class="hidden-modal-backdrop"
    >
      <div class="hidden-modal-dialog">
        <div class="hidden-modal-header">
          <h5 class="mb-0">Hidden restaurants</h5>
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            @click="showHiddenModal = false"
          />
        </div>
        <div class="hidden-modal-body">
          <div v-if="hiddenRestaurants.length === 0">No hidden restaurants.</div>
          <ul
            v-else
            class="list-group"
          >
            <li
              v-for="restaurant in hiddenRestaurants"
              :key="restaurant.id"
              class="list-group-item d-flex justify-content-between align-items-center"
            >
              <marquee
                v-if="store.state.retardMode"
                :scrollamount="scaledScrollAmount()"
                style="max-width: 400px"
              >
                {{ restaurant.restaurant }}
              </marquee>
              <span v-else>{{ restaurant.restaurant }}</span>
              <button
                type="button"
                class="btn btn-sm btn-primary"
                @click="unhideRestaurant(restaurant.id)"
              >
                Unhide
              </button>
            </li>
          </ul>
        </div>
        <div class="hidden-modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            @click="showHiddenModal = false"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { key } from "../store";
import type { RestaurantDay } from "../types/Restaurant";

const props = defineProps<{
  menus: RestaurantDay[];
}>();

const store = useStore(key);

const showHiddenModal = ref(false);

const hideButtonClass = computed(() => {
  return store.state.darkTheme
    ? "btn btn-outline-secondary hide-button-dark"
    : "btn btn-outline-primary hide-button-light";
});

const randomScrollAmount = () => Math.floor(Math.random() * 70) + 30;

const scaledScrollAmount = () => Math.floor(randomScrollAmount() * store.state.retardScale);

const isRestaurantHidden = (id: number): boolean => {
  return store.state.restaurantOrder.find((item) => item.id === id)?.isHidden ?? false;
};

const hiddenRestaurants = computed(() => props.menus.filter((restaurant) => isRestaurantHidden(restaurant.id)));

const unhideRestaurant = (id: number) => {
  store.commit("setRestaurantVisible", id);
};
</script>

<style scoped>
.hidden-modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.hidden-modal-dialog {
  background-color: var(--bs-body-bg);
  color: var(--bs-body-color);
  border-radius: 0.5rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.hidden-modal-header,
.hidden-modal-footer {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.hidden-modal-footer {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 0;
}

.hidden-modal-body {
  padding: 0.75rem 1rem;
  max-height: 60vh;
  overflow-y: auto;
}

.hide-button-dark {
  color: white;
}

.hide-button-light {
  color: black;
}
</style>
