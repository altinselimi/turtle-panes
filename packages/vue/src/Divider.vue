<template>
  <div class="turtle-panes__divider-wrapper">
    <div
      v-if="!slots[slotName]"
      ref="dividerRef"
      @mousedown="handleMouseDown"
      @touchstart="handleMouseDown"
      class="turtle-panes__divider-target"
      :data-testid="`divider-${props.paneId}`"
    ></div>
    <div
      v-else
      ref="dividerRef"
      @mousedown="handleMouseDown"
      @touchstart="handleMouseDown"
      class="turtle-panes__divider-custom"
      :data-testid="`divider-${props.paneId}`"
    >
      <slot :name="slotName"></slot>
    </div>
  </div>
</template>
<script lang="ts">
export const slotName = "custom-divider";
</script>
<script setup lang="ts">
import { ref, inject, computed, useSlots } from "vue";
import { attachPaneDividerInteractionListeners } from "@turtle-panes/core";
import type { Ref, Reactive, Slot } from "vue";
import { ContextType } from "@turtle-panes/core/types";
import { useLogs } from "@turtle-panes/core";
const { logError } = useLogs();

const props = defineProps<{
  paneId?: number | null;
}>();

const dividerRef: Ref<HTMLElement | null> = ref(null);
const clientXOnMouseDown: Ref<number | null> = ref(null);
const isDraggingToGrowth: Ref<boolean | null> = ref(null);
const contextRef: Reactive<ContextType> | undefined = inject("context");
if (!contextRef) {
  throw new Error("Pane is not wrapped in Panes component");
}
const context = contextRef;
const isInteractingWithDivider = computed(
  () => context.state.activePaneId === props.paneId,
);
const isInteractingWithAnotherDivider = computed(
  () => context.state.activePaneId && !isInteractingWithDivider.value,
);

const handleMouseMove = (e: MouseEvent | TouchEvent) => {
  const eClientX = getMouseClientX(e);
  const movementFromStart = Math.abs(
    eClientX - (clientXOnMouseDown.value as number),
  );
  const dividerRect = (
    dividerRef.value as HTMLElement
  )?.getBoundingClientRect();
  const mouseMoveStartThreshold = dividerRect.width / 2;
  if (
    !isInteractingWithDivider.value ||
    movementFromStart < mouseMoveStartThreshold
  )
    return;
  try {
    isDraggingToGrowth.value = true;
    const dividerClientX = dividerRect.left + mouseMoveStartThreshold;
    const mouseMovementInPx = eClientX - dividerClientX;
    const newWidth =
      context.state.panes[props.paneId as number].width + mouseMovementInPx;
    context.updatePaneWidth(props.paneId as number, newWidth);
    context.setPixelsTravelled(mouseMovementInPx);
  } catch (e) {
    logError(e);
    handleMouseUp();
  }
};

const getMouseClientX = (e: MouseEvent | TouchEvent): number => {
  if (e instanceof MouseEvent) {
    return e.clientX;
  }
  return e.touches[0].clientX;
};

const handleMouseUp = () => {
  isDraggingToGrowth.value = null;
  context.resetInteractionState();
};

const handleMouseDown = (e: MouseEvent | TouchEvent) => {
  if (isInteractingWithAnotherDivider.value) return;
  context.setActivePane(props.paneId as number);
  clientXOnMouseDown.value = getMouseClientX(e);

  if (window.getSelection) {
    window.getSelection()?.removeAllRanges();
  }

  attachPaneDividerInteractionListeners({
    mouseMoveCallback: handleMouseMove,
    mouseUpCallback: handleMouseUp,
  });
};

const slots: { [key: string]: Slot | undefined } = useSlots();
</script>
<style lang="scss">
.turtle-panes__divider {
  &-wrapper {
    width: 0px;
    overflow: visible;
    z-index: 2;
    position: relative;
    pointer-events: all;
  }
  &-target {
    cursor: col-resize;
    position: absolute;
    top: 0;
    bottom: 0;
    width: 10px;
    height: 100%;
    left: 50%;
    transform: translateX(-50%);
    &:before {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 1px;
      background-color: rgba(0, 0, 0, 0.2);
    }
  }
  &-custom {
    cursor: col-resize;
    height: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    transform: translate(-50%);
    display: flex;
    justify-content: stretch;
  }
}
</style>
