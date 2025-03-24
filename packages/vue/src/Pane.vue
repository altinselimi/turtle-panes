<template>
  <div
    class="turtle-panes__pane"
    :class="{
      'is-hidden': !isPaneVisible && isContainerMounted,
      'is-visible': isPaneVisible && isContainerMounted,
      'is-flex': props.isFlex,
    }"
    :style="styleToPreventFlexOvergrowingOnPaneReappearance"
    ref="paneWrapperRef"
  >
    <div
      class="turtle-panes__pane-content"
      :style="computedStyles"
      ref="paneContentRef"
      :data-testid="`pane-${id}`"
    >
      <div class="turtle-panes__pane-content-wrapper">
        <slot></slot>
      </div>
    </div>
    <Divider :paneId="id" v-if="!props.hideDivider">
      <template v-slot:[dividerSlotName] v-if="slots['divider']">
        <slot name="divider"></slot>
      </template>
    </Divider>
  </div>
</template>
<script setup lang="ts">
import { inject, onMounted, ref, computed, useSlots, watchEffect } from "vue";
import { ContextType, PaneComponentProps } from "@turtle-panes/core/types";
import type { CSSProperties } from "vue";
import { useComputedHooks } from "./hooks/usePaneComputedHooks";
import type { Reactive, Ref } from "vue";
import Divider from "./Divider.vue";
import { defaultPaneProps } from "@turtle-panes/core";
import { slotName as dividerSlotName } from "./Divider.vue";

const props = withDefaults(defineProps<PaneComponentProps>(), defaultPaneProps);
const contextRef: Reactive<ContextType> | undefined = inject("context");
if (!contextRef) {
  throw new Error("Pane is not wrapped in Panes component");
}
const slots = useSlots();

const context = contextRef;
const id: Ref<number | null> = ref(null);
const paneContentRef: Ref<HTMLElement | null> = ref(null);
const paneWrapperRef: Ref<HTMLElement | null> = ref(null);

const {
  isPaneVisible,
  isContainerMounted,
  widthFromContext,
  dividerTravelledPx,
} = useComputedHooks(id, context);

const storePaneInContext = async () => {
  // for some reason boundingClientRect of wrapper is 1px more
  // but we still need it if we want to use the flex width
  const targetRef = props.isFlex ? paneWrapperRef : paneContentRef;
  const clientRect = targetRef?.value
    ? (targetRef?.value as HTMLElement)?.getBoundingClientRect()
    : null;
  if (!clientRect) return;
  let newWidth = clientRect.width || props.minWidth;
  if (newWidth < props.minWidth) {
    newWidth = props.minWidth;
  } else if (newWidth > props.maxWidth) {
    newWidth = props.maxWidth;
  }

  id.value = await context.addPane({
    width: props.initialWidth ? props.initialWidth : newWidth,
    minWidth: props?.minWidth || 0,
    maxWidth: props?.maxWidth,
    isVisible: props?.isVisible || true,
    hideOnMinWidthExceeded: props?.hideOnMinWidthExceeded,
    preventContentOverflow: props?.preventContentOverflow,
    isFlex: props?.isFlex,
    id: id.value,
  });
};

onMounted(storePaneInContext);

const computedStyles = computed<CSSProperties>(() => {
  if (!id.value) {
    const initialStyles: CSSProperties = {
      minWidth: `${props.minWidth}px`,
    };
    if (props.maxWidth) initialStyles["maxWidth"] = `${props.maxWidth}px`;
    if (props.initialWidth) initialStyles["width"] = `${props.initialWidth}px`;

    return initialStyles;
  }

  if (!isContainerMounted.value) return {};
  const pane = context.state.panes[id.value];
  return {
    width: pane.isVisible ? `${pane?.width}px` : "0px",
    visibility: pane?.isVisible ? "visible" : "hidden",
    overflow: props.allowOverflow ? "auto" : "hidden",
  };
});

const stopWatcher = watchEffect(() => {
  const { preventContentOverflow } = props;
  if (!id.value || !preventContentOverflow) return;

  stopWatcher();
});

// TODO: better naming
const styleToPreventFlexOvergrowingOnPaneReappearance = computed<CSSProperties>(
  () => {
    return props.isFlex && widthFromContext.value
      ? { maxWidth: `${widthFromContext.value}px` }
      : {};
  },
);

watchEffect(() => {
  if (!props.preventContentOverflow || !dividerTravelledPx.value) return;
  const [widthOfContent, widthProvidedByPane] = [
    paneContentRef.value?.scrollWidth || 0,
    paneContentRef.value?.clientWidth || 0,
  ];

  context.updatePaneContentWidth(
    id.value as number,
    widthOfContent,
    widthProvidedByPane,
  );
});
</script>
<style lang="scss">
.turtle-panes {
  &__pane {
    display: flex;
    justify-content: space-between;

    &.is-hidden {
      display: none;
    }
    &.is-flex {
      flex: 1;
    }
    &:nth-last-child(1 of .is-visible) .turtle-panes__divider-wrapper {
      display: none;
    }
  }

  &__pane-content {
    // WORKAROUND
    // This element is added as a workaround for content.scrollWidth not reporting correct values:
    // When the immediate rendered block element has justify-content applied, the scrollWidth
    // does not return the full width of the content.
    &-wrapper {
      display: flex;
      height: 100%;
    }
  }
}
</style>
