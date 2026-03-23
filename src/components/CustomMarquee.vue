<template>
  <div
    class="custom-marquee-container"
    ref="container"
    :class="[direction, behavior]"
  >
    <div
      class="custom-marquee-content"
      ref="content"
      :style="animationStyle"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from "vue";

const props = withDefaults(
  defineProps<{
    direction?: "left" | "right" | "up" | "down";
    behavior?: "scroll" | "alternate";
    scrollamount?: number;
  }>(),
  {
    direction: "left",
    behavior: "scroll",
    scrollamount: 6,
  },
);

const container = ref<HTMLElement | null>(null);
const content = ref<HTMLElement | null>(null);
const containerSize = ref(0);
const contentSize = ref(0);

const updateSizes = () => {
  if (container.value && content.value) {
    if (props.direction === "left" || props.direction === "right") {
      containerSize.value = container.value.offsetWidth;
      contentSize.value = content.value.offsetWidth;
    } else {
      containerSize.value = container.value.offsetHeight;
      contentSize.value = content.value.offsetHeight;
    }
  }
};

const animationStyle = computed(() => {
  if (containerSize.value === 0 || contentSize.value === 0) return {};

  const distance = props.behavior === "alternate" 
    ? containerSize.value - contentSize.value 
    : containerSize.value + contentSize.value;
  
  // Basic speed calculation: scrollamount is roughly pixels per frame (at 60fps)
  // Total distance / (scrollamount * 60) = duration in seconds
  const duration = Math.abs(distance) / (props.scrollamount * 30); // Adjusted to be faster

  return {
    "--marquee-duration": `${duration}s`,
    "--marquee-distance": `${distance}px`,
    "--marquee-content-size": `${contentSize.value}px`,
    "--marquee-container-size": `${containerSize.value}px`,
  };
});

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  updateSizes();
  if (container.value) {
    resizeObserver = new ResizeObserver(updateSizes);
    resizeObserver.observe(container.value);
    if (content.value) {
      resizeObserver.observe(content.value);
    }
  }
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});

watch(() => props.direction, updateSizes);
</script>

<style scoped>
.custom-marquee-container {
  overflow: hidden;
  position: relative;
  display: flex;
}

.custom-marquee-container.left, .custom-marquee-container.right {
  flex-direction: row;
  align-items: center;
}

.custom-marquee-container.up, .custom-marquee-container.down {
  flex-direction: column;
  justify-content: center;
}

.custom-marquee-content {
  white-space: nowrap;
  display: inline-block;
  will-change: transform;
}

/* Behavior: SCROLL */
.scroll.left .custom-marquee-content {
  animation: scroll-left var(--marquee-duration) linear infinite;
}
.scroll.right .custom-marquee-content {
  animation: scroll-right var(--marquee-duration) linear infinite;
}
.scroll.up .custom-marquee-content {
  animation: scroll-up var(--marquee-duration) linear infinite;
}
.scroll.down .custom-marquee-content {
  animation: scroll-down var(--marquee-duration) linear infinite;
}

/* Behavior: ALTERNATE */
.alternate.left .custom-marquee-content {
  animation: alternate-left var(--marquee-duration) linear infinite alternate;
}
.alternate.right .custom-marquee-content {
  animation: alternate-right var(--marquee-duration) linear infinite alternate;
}
.alternate.up .custom-marquee-content {
  animation: alternate-up var(--marquee-duration) linear infinite alternate;
}
.alternate.down .custom-marquee-content {
  animation: alternate-down var(--marquee-duration) linear infinite alternate;
}

@keyframes scroll-left {
  0% { transform: translateX(var(--marquee-container-size)); }
  100% { transform: translateX(calc(-1 * var(--marquee-content-size))); }
}

@keyframes scroll-right {
  0% { transform: translateX(calc(-1 * var(--marquee-content-size))); }
  100% { transform: translateX(var(--marquee-container-size)); }
}

@keyframes scroll-up {
  0% { transform: translateY(var(--marquee-container-size)); }
  100% { transform: translateY(calc(-1 * var(--marquee-content-size))); }
}

@keyframes scroll-down {
  0% { transform: translateY(calc(-1 * var(--marquee-content-size))); }
  100% { transform: translateY(var(--marquee-container-size)); }
}

@keyframes alternate-left {
  0% { transform: translateX(calc(var(--marquee-container-size) - var(--marquee-content-size))); }
  100% { transform: translateX(0); }
}

@keyframes alternate-right {
  0% { transform: translateX(0); }
  100% { transform: translateX(calc(var(--marquee-container-size) - var(--marquee-content-size))); }
}

@keyframes alternate-up {
  0% { transform: translateY(calc(var(--marquee-container-size) - var(--marquee-content-size))); }
  100% { transform: translateY(0); }
}

@keyframes alternate-down {
  0% { transform: translateY(0); }
  100% { transform: translateY(calc(var(--marquee-container-size) - var(--marquee-content-size))); }
}
</style>
