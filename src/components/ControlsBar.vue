<template>
  <div class="controls-bar">
    <div class="controls-bar__day">
      <DaySelection
        :selected="selectedDay"
        :update-func="onDaySelect"
      />
    </div>
    <div
      v-if="isSpecialMode"
      class="controls-bar__retard-scale"
    >
      <RetardScale />
    </div>
    <div class="controls-bar__actions">
      <HiddenMenusDialog :menus="menus" />
      <div class="controls-bar__selectors">
        <ThemeSelector />
        <RetardSelector />
        <FilipSelector />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";
import { key } from "../store";
import type { RestaurantDay } from "../types/Restaurant";
import DaySelection from "./DaySelection.vue";
import HiddenMenusDialog from "./HiddenMenusDialog.vue";
import RetardScale from "./RetardScale.vue";
import ThemeSelector from "./ThemeSelector.vue";
import RetardSelector from "./RetardSelector.vue";
import FilipSelector from "./FilipSelector.vue";

defineProps<{
  menus: RestaurantDay[];
  selectedDay: number;
  onDaySelect: (day: number) => void;
}>();

const store = useStore(key);
const isSpecialMode = computed(() => store.state.retardMode || store.state.filipMode);
</script>

<style scoped>
.controls-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.controls-bar__day {
  width: 100%;
  display: flex;
  justify-content: center;
}

.controls-bar__retard-scale {
  width: 100%;
}

.controls-bar__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  justify-content: center;
}

.controls-bar__selectors {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
}

@media (min-width: 768px) {
  .controls-bar__day {
    flex: 1;
    width: auto;
    justify-content: flex-start;
  }

  .controls-bar__retard-scale {
    width: auto;
  }

  .controls-bar__actions {
    width: auto;
    justify-content: flex-start;
  }
}
</style>
