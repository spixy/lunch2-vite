<template>
  <div
    id="lunchinator"
    class="pt-4"
  >
    <h1
      class="text-center"
      :class="{ 'retard-bounce': isSpecialMode }"
    >
      <marquee
        v-if="isSpecialMode"
        :key="retardScaleKey"
        behavior="alternate"
        :scrollamount="20 * retardScale"
      >
        {{ title }}
      </marquee>
      <template v-else>
        {{ title }}
      </template>
    </h1>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";
import { key } from "../store";

const titles = [
  "Hop Hop",
  "Pomáhame si",
  "bum bum to dělá",
  "Teď se du vysrat, ale pořádne",
  "tady je bubak ty ho nevidiš ale ja jo",
  "- To jsou písmenka nebo čísla?",
  "- To je kubatura, ale nevím co to je",
  "- To udělali vaši lidi",
  "Žádám aby to bylo řádně vyšetřeno",
  "Zabiju se",
  "Já mu trefim",
  "a pivko na pni",
  "televizia Markíza uvádzá {title}",
  "V O L H A",
  "- Pomoc",
];

const store = useStore(key);

const isSpecialMode = computed(() => store.state.retardMode || store.state.filipMode);
const retardScale = computed(() => store.state.retardScale);
const retardScaleKey = computed(() => retardScale.value.toFixed(2));

const title = computed(() => {
  const currentTitle = titles[Math.floor(Math.random() * titles.length)];
  if (currentTitle.includes("{title}")) {
    return currentTitle.replace("{title}", "Lunchinator");
  }
  return "Lunchinator " + currentTitle;
});
</script>

<style scoped>
.retard-bounce {
  animation: retard-bounce 0.5s infinite linear;
  display: block;
}

@keyframes retard-bounce {
  0% {
    transform: translateY(0) rotate(0deg) scale(1);
    color: #ff0000;
  }
  25% {
    color: #ffff00;
    transform: translateY(-10px) rotate(-5deg) scale(1.1);
  }
  50% {
    color: #00ff00;
    transform: translateY(-20px) rotate(5deg) scale(1.2);
    text-shadow:
      2px 2px 10px #ff00ff,
      -2px -2px 10px #00ffff;
  }
  75% {
    color: #00ffff;
    transform: translateY(-10px) rotate(-5deg) scale(1.1);
  }
  100% {
    transform: translateY(0) rotate(0deg) scale(1);
    color: #0000ff;
  }
}
</style>
