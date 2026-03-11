<template>
  <div class="form-check form-switch">
    <input
      id="flexSwitchCheckChecked"
      class="form-check-input"
      type="checkbox"
      role="switch"
      :checked="store.state.darkTheme"
      @click="toggleDarkTheme"
    />
    <label
      class="form-check-label"
      :style="{
        color: store.state.darkTheme ? 'var(--bs-body-color)' : 'var(--bs-primary)',
      }"
      for="flexSwitchCheckChecked"
    >
      <BiMoon v-if="store.state.darkTheme" />
      <BiSolidSun v-else />
    </label>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "vuex";
import { key } from "../store";
import { BiMoon, BiSolidSun } from "vue-icons-plus/bi";

const store = useStore(key);

const toggleDarkTheme = () => {
  store.commit("toggleDarkTheme");
  document.body.dataset.bsTheme = store.state.darkTheme ? "dark" : "light";
};
</script>
