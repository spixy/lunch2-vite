<template>
  <div
    v-if="store.state.retardMode || store.state.filipMode"
    class="mt-2"
  >
    <input
      v-model.number="retardScale"
      type="range"
      min="0.5"
      max="10"
      step="0.5"
      class="form-range"
    />
    <label class="form-label mb-1"> {{ store.state.filipMode ? 'Filip scale' : 'Retard scale' }}: {{ retardScale }} </label>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";
import { key } from "../store";

const store = useStore(key);

const retardScale = computed({
  get: () => store.state.retardScale,
  set: (value: number) => {
    store.commit("setRetardScale", value);
  },
});
</script>
