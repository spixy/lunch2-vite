<template>
  <RetardBackground />
  <AwpOverlay />
  <AppTitle />
  <div class="p-4">
    <ControlsBar
      :menus="menus"
      :selected-day="selectedDay"
      :on-day-select="getRestaurantsForDay"
    />
    <Draggable
      v-model="menus"
      v-bind="dragOptions"
      @start="onStart"
      @end="onEnd"
    >
      <template #item="{ element }">
        <MenuCard
          v-if="!isRestaurantHidden(element.id)"
          :menu="element"
          :swap-function="swapRestaurants"
        />
      </template>
    </Draggable>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useStore } from "vuex";
import { key } from "./store";
import Draggable from "vuedraggable";
import MenuCard from "./components/MenuCard.vue";
import RetardBackground from "./components/RetardBackground.vue";
import AwpOverlay from "./components/AwpOverlay.vue";
import AppTitle from "./components/AppTitle.vue";
import ControlsBar from "./components/ControlsBar.vue";
import { useRestaurants } from "./composables/useRestaurants";
import { useDraggable } from "./composables/useDraggable";

const store = useStore(key);

const { menus, selectedDay, getRestaurantsForDay, swapRestaurants, isRestaurantHidden, saveOrderAfterDrag } =
  useRestaurants();
const { dragOptions, onStart, onEnd } = useDraggable(saveOrderAfterDrag);

onMounted(() => {
  document.body.setAttribute("data-bs-theme", store.state.darkTheme ? "dark" : "light");
});

getRestaurantsForDay(selectedDay.value);
</script>

<style lang="scss">
@import "./assets/scss/style.scss";
</style>
