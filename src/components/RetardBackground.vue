<template>
  <div
    v-if="store.state.retardMode || store.state.filipMode"
    class="retard-background"
    :class="{ flashing: store.state.backgroundFlashing }"
  >
    <div
      v-for="(img, index) in selectedImages"
      :key="index + '-' + retardScaleKey"
      class="image-container"
      :style="containerStyles[index]"
    >
      <CustomMarquee
        :behavior="behaviors[index % behaviors.length]"
        :direction="horizontalDirections[index % horizontalDirections.length]"
        :scrollamount="scaledScrollAmount(index)"
        class="floating-marquee-horizontal"
      >
        <CustomMarquee
          :behavior="behaviors[(index + 1) % behaviors.length]"
          :direction="verticalDirections[index % verticalDirections.length]"
          :scrollamount="scaledScrollAmount(index + 1)"
          class="floating-marquee-vertical"
        >
          <img
            :src="img"
            class="floating-img"
            :class="{ spinning: spinningIndex === index }"
          />
        </CustomMarquee>
      </CustomMarquee>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "vuex";
import { key } from "../store";
import { ref, onMounted, watch, onUnmounted, computed } from "vue";
import penzionAudio from "../assets/audio/penzion.mp3";
import panjabiAudio from "../assets/audio/panjabi.mp3";
import CustomMarquee from "./CustomMarquee.vue";

const store = useStore(key);
const selectedImages = ref<string[]>([]);
const spinningIndex = ref<number | null>(null);
const containerStyles = ref<{ top: string }[]>([]);
let chaosInterval: ReturnType<typeof setInterval> | null = null;
const audio = new Audio(penzionAudio);
audio.loop = true;
const audioFilip = new Audio(panjabiAudio);
audioFilip.loop = true;

// Get all jpg images from the assets folder
const retardImagesGlob = import.meta.glob<string>("../assets/retard-images/*.{jpg,png,gif}", {
  eager: true,
  query: "?url",
  import: "default",
});
const filipImagesGlob = import.meta.glob<string>("../assets/filip-images/*.{jpg,png,gif}", {
  eager: true,
  query: "?url",
  import: "default",
});

const retardImagePaths = Object.values(retardImagesGlob);
const filipImagePaths = Object.values(filipImagesGlob);

const imagePaths = computed(() => {
  if (store.state.filipMode) {
    return filipImagePaths;
  }
  return retardImagePaths;
});

const behaviors = ["alternate", "scroll"] as const;
const horizontalDirections = ["left", "right"] as const;
const verticalDirections = ["up", "down"] as const;
const scrollAmounts = [10, 15, 20, 25, 30, 35];

const retardScale = computed(() => store.state.retardScale);
const retardScaleKey = computed(() => retardScale.value.toFixed(2));

const scaledScrollAmount = (index: number) => scrollAmounts[index % scrollAmounts.length] * retardScale.value;

const selectRandomImages = () => {
  if (imagePaths.value.length === 0) return;

  const shuffled = [...imagePaths.value].sort(() => 0.5 - Math.random());
  const limit = store.state.filipMode ? 4 : 4;
  selectedImages.value = shuffled.slice(0, limit);

  // Randomize starting top positions and rotation for containers to cover more screen height and move randomly
  containerStyles.value = selectedImages.value.map(() => ({
    top: Math.random() * 60 + "vh",
    transform: `rotate(${Math.random() * 360}deg)`,
  }));
};

const startChaosLogic = () => {
  stopChaosLogic();
  chaosInterval = setInterval(() => {
    // 1. Spin one random image
    spinningIndex.value = Math.floor(Math.random() * selectedImages.value.length);
    setTimeout(() => {
      spinningIndex.value = null;
    }, 2000); // Spin for 2 seconds

    // 2. Change images every 5 seconds
    if (imagePaths.value.length > 0) {
      const newImages = [...selectedImages.value];
      for (let i = 0; i < newImages.length; i++) {
        newImages[i] = imagePaths.value[Math.floor(Math.random() * imagePaths.value.length)];
      }
      selectedImages.value = newImages;
    }
  }, 5000);
};

const stopChaosLogic = () => {
  if (chaosInterval) {
    clearInterval(chaosInterval);
    chaosInterval = null;
  }
};

onMounted(() => {
  selectRandomImages();
  if (store.state.retardMode || store.state.filipMode) {
    startChaosLogic();
  }
  if (store.state.retardMode) {
    audio.playbackRate = retardScale.value;
    audio.play().catch((e) => console.log("Audio play failed:", e));
  }
  if (store.state.filipMode) {
    audioFilip.playbackRate = retardScale.value;
    audioFilip.play().catch((e) => console.log("Audio play failed:", e));
  }
});

onUnmounted(() => {
  stopChaosLogic();
  audio.pause();
  audioFilip.pause();
});

// Re-select images when retard mode is toggled to make it more "random" each time
watch(
  () => store.state.retardMode,
  (newVal) => {
    if (newVal) {
      selectRandomImages();
      startChaosLogic();
      audio.playbackRate = retardScale.value;
      audio.play().catch((e) => console.log("Audio play failed:", e));
    } else {
      audio.pause();
      if (!store.state.filipMode) {
        stopChaosLogic();
      }
    }
  },
);

watch(
  () => retardScale.value,
  (newVal) => {
    audio.playbackRate = newVal;
    audioFilip.playbackRate = newVal;
  },
);

watch(
  () => store.state.filipMode,
  (newVal) => {
    if (newVal) {
      selectRandomImages();
      startChaosLogic();
      audioFilip.playbackRate = retardScale.value;
      audioFilip.play().catch((e) => console.log("Audio play failed:", e));
    } else {
      audioFilip.pause();
      if (!store.state.retardMode) {
        stopChaosLogic();
      } else {
        selectRandomImages();
      }
    }
  },
);
</script>

<style scoped>
.retard-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
  opacity: 0.5;
}

.flashing {
  animation: retard-bounce 0.5s infinite linear;
  opacity: 1;
}

@keyframes retard-bounce {
  0% {
    background-color: #ff0000;
  }
  25% {
    background-color: #ffff00;
  }
  50% {
    background-color: #00ff00;
  }
  75% {
    background-color: #00ffff;
  }
  100% {
    background-color: #0000ff;
  }
}

.image-container {
  position: absolute;
  width: 100%;
  height: 400px; /* Give it some height for the vertical marquee to work in */
  overflow: visible;
}

.floating-marquee-horizontal {
  width: 100%;
  height: 100%;
}

.floating-marquee-vertical {
  width: 100%;
  height: 100%;
}

.floating-img {
  max-width: 400px;
  max-height: 400px;
  transition: transform 0.5s;
}

.spinning {
  animation: spin 1s infinite linear;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
