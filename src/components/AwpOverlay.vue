<template>
  <img
    v-if="store.state.awpVisible && store.state.retardMode"
    :key="Math.random()"
    src="../assets/retard-images/no-scope/awp.png"
    class="awp-animation"
    :class="'corner-' + store.state.awpCorner"
    alt="AWP"
  />
</template>

<script setup lang="ts">
import { useStore } from "vuex";
import { key } from "../store";

const store = useStore(key);
</script>

<style scoped>
.awp-animation {
  position: fixed;
  z-index: 9999;
  pointer-events: none;
}

.corner-top-left {
  animation: from-top-left 2.5s forwards;
}

.corner-top-right {
  animation: from-top-right 2.5s forwards;
}

.corner-bottom-left {
  animation: from-bottom-left 2.5s forwards;
}

.corner-bottom-right {
  animation: from-bottom-right 2.5s forwards;
}

@keyframes from-top-left {
  0% {
    top: 0;
    left: 0;
    transform: translate(-100%, -100%) rotate(0deg);
  }
  40% {
    top: 100%;
    left: 50%;
    transform: translate(-50%, -100%) rotate(720deg);
  }
  60% {
    top: 100%;
    left: 50%;
    transform: translate(-50%, -100%) rotate(720deg);
  }
  100% {
    top: 0;
    left: 0;
    transform: translate(-100%, -100%) rotate(0deg);
  }
}

@keyframes from-top-right {
  0% {
    top: 0;
    left: 100%;
    transform: translate(0, -100%) rotate(0deg);
  }
  40% {
    top: 100%;
    left: 50%;
    transform: translate(-50%, -100%) rotate(720deg);
  }
  60% {
    top: 100%;
    left: 50%;
    transform: translate(-50%, -100%) rotate(720deg);
  }
  100% {
    top: 0;
    left: 100%;
    transform: translate(0, -100%) rotate(0deg);
  }
}

@keyframes from-bottom-left {
  0% {
    top: 100%;
    left: 0;
    transform: translate(-100%, 0) rotate(0deg);
  }
  40% {
    top: 100%;
    left: 50%;
    transform: translate(-50%, -100%) rotate(720deg);
  }
  60% {
    top: 100%;
    left: 50%;
    transform: translate(-50%, -100%) rotate(720deg);
  }
  100% {
    top: 100%;
    left: 0;
    transform: translate(-100%, 0) rotate(0deg);
  }
}

@keyframes from-bottom-right {
  0% {
    top: 100%;
    left: 100%;
    transform: translate(0, 0) rotate(0deg);
  }
  40% {
    top: 100%;
    left: 50%;
    transform: translate(-50%, -100%) rotate(720deg);
  }
  60% {
    top: 100%;
    left: 50%;
    transform: translate(-50%, -100%) rotate(720deg);
  }
  100% {
    top: 100%;
    left: 100%;
    transform: translate(0, 0) rotate(0deg);
  }
}
</style>
