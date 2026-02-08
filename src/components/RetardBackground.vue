<template>
  <div v-if="store.state.retardMode" class="retard-background">
    <div v-for="(img, index) in selectedImages" :key="index" class="image-container" :style="containerStyles[index]">
      <marquee :behavior="behaviors[index % behaviors.length]"
               :direction="horizontalDirections[index % horizontalDirections.length]"
               :scrollamount="scrollAmounts[index % scrollAmounts.length]"
               class="floating-marquee-horizontal">
        <marquee :behavior="behaviors[(index + 1) % behaviors.length]"
                 :direction="verticalDirections[index % verticalDirections.length]"
                 :scrollamount="scrollAmounts[(index + 1) % scrollAmounts.length]"
                 class="floating-marquee-vertical">
          <img :src="img" class="floating-img" :class="{ 'spinning': spinningIndex === index }" />
        </marquee>
      </marquee>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from 'vuex';
import { key } from '../store';
import { ref, onMounted, watch, onUnmounted } from 'vue';

const store = useStore(key);
const selectedImages = ref<string[]>([]);
const spinningIndex = ref<number | null>(null);
const containerStyles = ref<any[]>([]);
let chaosInterval: any = null;

// Get all jpg images from the assets folder
const images = import.meta.glob('../assets/retard-images/*.jpg', { eager: true, as: 'url' });
const imagePaths = Object.values(images);

const behaviors = ['alternate', 'scroll'];
const horizontalDirections = ['left', 'right'];
const verticalDirections = ['up', 'down'];
const scrollAmounts = [10, 15, 20, 25, 30, 35];

const selectRandomImages = () => {
  if (imagePaths.length === 0) return;

  const shuffled = [...imagePaths].sort(() => 0.5 - Math.random());
  selectedImages.value = shuffled.slice(0, 2);

  // Randomize starting top positions for containers to cover more screen height
  containerStyles.value = selectedImages.value.map(() => ({
    top: Math.random() * 60 + 'vh'
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
    if (imagePaths.length > 0) {
      const newImages = [...selectedImages.value];
      for (let i = 0; i < newImages.length; i++) {
        newImages[i] = imagePaths[Math.floor(Math.random() * imagePaths.length)];
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
  if (store.state.retardMode) {
    startChaosLogic();
  }
});

onUnmounted(() => {
  stopChaosLogic();
});

// Re-select images when retard mode is toggled to make it more "random" each time
watch(() => store.state.retardMode, (newVal) => {
  if (newVal) {
    selectRandomImages();
    startChaosLogic();
  } else {
    stopChaosLogic();
  }
});
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

.image-container {
  position: absolute;
  width: 100%;
  height: 400px; /* Give it some height for the vertical marquee to work in */
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
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
