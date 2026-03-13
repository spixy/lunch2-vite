import { ref, computed, onUnmounted } from "vue";

export function useDraggable(onDragEnd: () => void) {
  const drag = ref(false);

  const dragOptions = computed(() => ({
    class: "row equal row-cols-1 justify-content-center",
    animation: 200,
    group: "description",
    ghostClass: "ghost",
    itemKey: "id",
    delay: 200,
    delayOnTouchOnly: true,
    touchStartThreshold: 4,
    forceFallback: true,
    componentData: {
      tag: "ul",
      type: "transition-group",
      name: !drag.value ? "flip-list" : null,
    },
  }));

  const handleWheel = (e: WheelEvent) => {
    window.scrollBy({ top: e.deltaY, behavior: "instant" });
  };

  const onStart = () => {
    drag.value = true;
    window.addEventListener("wheel", handleWheel);
  };

  const onEnd = () => {
    drag.value = false;
    window.removeEventListener("wheel", handleWheel);
    onDragEnd();
  };

  onUnmounted(() => {
    window.removeEventListener("wheel", handleWheel);
  });

  return { dragOptions, onStart, onEnd };
}
