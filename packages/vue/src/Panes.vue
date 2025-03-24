<template>
  <div
    class="turtle-panes__wrapper"
    ref="panesWrapperRef"
    :class="{ 'is-resizing': isInteractingWithADivider }"
  >
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { ref, provide, onMounted, onUnmounted, computed } from "vue";
import { createContext } from "./vue-state-adapter";
import type { ExposedFunctions } from "@turtle-panes/core/types";

const contextRef = createContext();

provide("context", contextRef);

const panesWrapperRef = ref(null as HTMLElement | null);

const isInteractingWithADivider = computed(
  () => contextRef.state.activePaneId !== null,
);

let resizeObserver: ResizeObserver | null = null;
const updateContainerWidthOnResize = () => {
  if (window.ResizeObserver === undefined) return;
  resizeObserver = new ResizeObserver(
    (entries: ResizeObserverEntry[]) => {
      const resizedPanesWrapperRef = entries.find(
        (entry: ResizeObserverEntry) => entry.target.isSameNode(panesWrapperRef.value),
      );
      if (!resizedPanesWrapperRef) return;
      const { scrollWidth } = resizedPanesWrapperRef.target as HTMLElement;
      contextRef.handleContainerResize(
        resizedPanesWrapperRef.contentRect.width,
        scrollWidth,
      );
    }
  );

  resizeObserver.observe(panesWrapperRef.value as Element);
};

onMounted(() => {
  const wrapperElement = panesWrapperRef.value;
  const { width = 0 } = wrapperElement?.getBoundingClientRect() || {};
  contextRef.setContainerWidth(width);
  updateContainerWidthOnResize();
});

onUnmounted(() => {
  contextRef.resetState();
  resizeObserver?.disconnect();
});

defineExpose<ExposedFunctions>({
  reShowPane: (id: number) => {
    if (contextRef.state.panes[id].isVisible) return;
    contextRef.reShowPane(id);
  },
  hidePane: (id: number) => {
    if (!contextRef.state.panes[id].isVisible) return;
    contextRef.hidePaneManually(id);
  },
  hiddenPanes: () => {
    return Object.values(contextRef.state.panes).filter(
      (pane) => !pane.isVisible,
    );
  },
});
</script>
<style lang="scss">
.turtle-panes {
  &__wrapper {
    display: flex;
    overflow: hidden;
    touch-action: none;
    &:has(> .turtle-panes__pane.is-flex) {
      align-self: stretch;
    }
    &.is-resizing {
      pointer-events: none;
      user-select: none;
      -webkit-user-select: none;
    }
  }
}
</style>
