import { useMemo } from "react";
import { Pane, ContextType } from "@turtle-panes/core/types";
import { getPaneSiblingId, getVisiblePanes } from "@turtle-panes/core";

export const useComputedHooks = (
  paneId: Pane["id"] | null,
  context: ContextType,
) => {
  const dividerTravelledPx = useMemo(
    () => context.state.pixelsTravelled,
    [context.state.pixelsTravelled],
  );

  const isInteractingWithADivider = useMemo(
    () => context.state.activePaneId != null,
    [context.state.activePaneId],
  );

  const isDependentOnCurrentActiveDivider = useMemo(() => {
    const activePaneId = context.state.activePaneId;
    if (!activePaneId) return false;
    const visiblePanes = getVisiblePanes(context.state.panes);
    const dependendOnPanes = [
      paneId,
      getPaneSiblingId(paneId!, visiblePanes, "left"),
    ].filter((paneId) => paneId);
    return dependendOnPanes.includes(activePaneId);
  }, [context.state.activePaneId, paneId, context.state.panes]);

  const isPaneVisible = useMemo(() => {
    return paneId && context.state.panes[paneId]?.isVisible;
  }, [paneId, context.state.panes]);

  const isContainerMounted = useMemo(() => {
    return context.state.containerWidth > 0;
  }, [context.state.containerWidth]);

  const isDividerActive = useMemo(() => {
    return context.state.activePaneId === paneId;
  }, [context.state.activePaneId, paneId]);

  const isLastPane = useMemo(() => {
    return getVisiblePanes(context.state.panes).at(-1)?.id === paneId;
  }, [context.state.panes, paneId]);


  const widthFromContext = useMemo(() => {
    return paneId && context.state.panes[paneId]?.width;
  }, [paneId, context.state.panes]);

  return {
    dividerTravelledPx,
    isInteractingWithADivider,
    isDependentOnCurrentActiveDivider,
    isPaneVisible,
    isContainerMounted,
    isDividerActive,
    isLastPane,
    widthFromContext,
  };
};
