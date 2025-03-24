import { computed } from "vue";
import { Pane, ContextType } from "@turtle-panes/core/types";
import type { Ref } from "vue";
import { getPaneSiblingId, getVisiblePanes } from "@turtle-panes/core";

export const useComputedHooks = (
  paneId: Ref<Pane["id"] | null>,
  context: ContextType,
) => {
  const dividerTravelledPx = computed(
    () => context.state.pixelsTravelled,
  );
  const isInteractingWithADivider = computed(
    () => context.state.activePaneId != null,
  );
  const isDependentOnCurrentActiveDivider = computed(() => {
    const activePaneId = context.state.activePaneId;
    if (!activePaneId) return false;
    const visiblePanes = getVisiblePanes(context.state.panes);
    const dependendOnPanes = [
      paneId.value,
      getPaneSiblingId(paneId.value!, visiblePanes, "left"),
    ].filter((paneId) => paneId);
    return dependendOnPanes.includes(activePaneId);
  });

  const isPaneVisible = computed(() => {
    return paneId.value && context.state.panes[paneId.value]?.isVisible;
  });

  const isContainerMounted = computed(() => {
    return context.state.containerWidth > 0;
  });

  const isDividerActive = computed(() => {
    return context.state.activePaneId === paneId.value;
  });

  const isLastPane = computed(() => {
    return getVisiblePanes(context.state.panes).at(-1)?.id === paneId.value;
  });

  const widthFromContext = computed(() => {
    return paneId.value && context.state.panes[paneId.value].width;
  });

  return {
    isPaneVisible,
    dividerTravelledPx,
    isInteractingWithADivider,
    isDependentOnCurrentActiveDivider,
    isContainerMounted,
    isDividerActive,
    isLastPane,
    widthFromContext,
  };
};
