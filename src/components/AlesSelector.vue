<template>
  <div class="form-check form-switch">
    <input
      id="alesModeToggle"
      class="form-check-input"
      type="checkbox"
      :checked="store.state.alesMode"
      @change="toggleAlesMode"
    />
    <label
      class="form-check-label"
      for="alesModeToggle"
      >Aleš</label
    >
  </div>
</template>

<script setup lang="ts">
import { useStore } from "vuex";
import { key } from "../store.ts";

const store = useStore(key);

const toggleAlesMode = () => {
  store.commit("toggleAlesMode");
};
</script>
