<template>
  <div class="form-check form-switch">
    <input
      id="retardModeToggle"
      class="form-check-input"
      type="checkbox"
      :checked="store.state.retardMode"
      @change="toggleRetardMode"
    />
    <label
      class="form-check-label"
      for="retardModeToggle"
      >Retard</label
    >
  </div>
</template>

<script setup lang="ts">
import { useStore } from "vuex";
import { key } from "../store.ts";

const store = useStore(key);

const toggleRetardMode = () => {
  store.commit("toggleRetardMode");
};
</script>
