<template>
  <div class="form-check form-switch">
    <input
      id="filipModeToggle"
      class="form-check-input"
      type="checkbox"
      :checked="store.state.filipMode"
      @change="toggleFilipMode"
    />
    <label
      class="form-check-label"
      for="filipModeToggle"
      >Filip</label
    >
  </div>
</template>

<script setup lang="ts">
import { useStore } from "vuex";
import { key } from "../store.ts";

const store = useStore(key);

const toggleFilipMode = () => {
  store.commit("toggleFilipMode");
};
</script>
