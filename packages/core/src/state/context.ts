import {
  ContextAsyncMethods,
  ContextSyncMethods,
  ContextType,
  Pane,
} from "../types";
import {
  getNewPanesWidthToFillVacuumAfterPaneIsHidden,
  getNewPanesWidthToAccomodateReaddedPanes,
  calculateNewWidthForPanes,
  getPaneSiblingId,
  sortByClosestToPane,
  getVisiblePanes,
  getNewPanesWidthToAccomodateContainerShrinking,
  getNewPanesWidthToAccommodateContainerGrowing,
  getNewPanesWidthToAccomodateTargetShrinking,
} from "./contextHelpers";
import { useLogs } from "../helpers/useLogs";

const { logInfo } = useLogs();

export const createState = () => ({
  panes: {},
  containerWidth: 0,
  activePaneId: null,
  pixelsTravelled: 0,
});

export const createProxyState = (
  initialState: ContextType["state"],
  onUpdate: any,
) => {
  return new Proxy(initialState, {
    set(
      target: ContextType["state"],
      prop: keyof ContextType["state"],
      value: any,
    ) {
      target[prop] = value;
      onUpdate && onUpdate({ ...target });
      return true;
    },
  });
};

export const createActions = (
  state: ContextType["state"],
): ContextAsyncMethods & ContextSyncMethods => ({
  getPanes() {
    return JSON.parse(JSON.stringify(state.panes));
  },
  getNextId() {
    return Object.keys(state.panes).length + 1;
  },
  setPanes(newPanes) {
    state.panes = newPanes;
  },
  addPane(pane) {
    return new Promise((resolve) => {
      const id = pane?.id || Object.keys(state.panes).length + 1;
      state.panes[id] = { ...pane, id };
      resolve(id);
    });
  },
  addPaneSync(pane) {
    const id = pane?.id || Object.keys(state.panes).length + 1;
    state.panes[id] = { ...pane, id };
    return id;
  },
  updatePane(paneId, newProps) {
    if (!paneId) return;
    state.panes[paneId] = {
      ...state.panes[paneId],
      ...newProps,
    };
  },
  updatePaneWidth(paneId, newWidth) {
    const panes = this.getPanes();
    if (panes[paneId].isVisible === false) {
      logInfo("Pane is hidden. Cannot update width.");
      return;
    }
    const rightSiblingId = getPaneSiblingId(
      paneId,
      getVisiblePanes(panes),
      "right",
    );
    if (!rightSiblingId) {
      logInfo("Pane has no right sibling. Cannot update width.");
      return;
    }
    const [targetPane, siblingPane] = [panes[paneId], panes[rightSiblingId]];

    const {
      targetPane: updatedTargetPane,
      siblingPane: updatedSiblingPane,
      undistributedSpace,
    } = calculateNewWidthForPanes(targetPane, siblingPane, newWidth);
    if (undistributedSpace) {
      const otherPanesSorted = sortByClosestToPane(
        getVisiblePanes(state.panes),
        paneId,
      ).filter((p) => ![paneId, rightSiblingId].includes(p.id));
      getNewPanesWidthToAccomodateTargetShrinking(
        otherPanesSorted,
        undistributedSpace,
      ).forEach((updatedPane) => {
        panes[updatedPane.id].width = updatedPane.width;
      });
    }
    panes[paneId] = updatedTargetPane;
    panes[rightSiblingId] = updatedSiblingPane;
    this.setPanes(panes);
  },
  updatePaneContentWidth(paneId, widthOfContent, widthProvidedByPane) {
    const panes = this.getPanes();
    const isOverflowing = widthOfContent > widthProvidedByPane;
    const wasPaneAlreadyOverflowing = panes[paneId].isOverflowing;
    if (isOverflowing && wasPaneAlreadyOverflowing) {
      logInfo("Pane is already overflowing. Cannot update width.");
      return;
    }
    if (wasPaneAlreadyOverflowing && widthProvidedByPane === widthOfContent) {
      logInfo(
        "Pane width was reset to content. State is still overflowing.",
      );
      return;
    }
    panes[paneId].widthOfContent = widthOfContent;
    panes[paneId].widthProvidedByPane = widthProvidedByPane;
    panes[paneId].isOverflowing = isOverflowing;
    this.setPanes(panes);
  },
  reShowPane(paneId) {
    const currentPanes = this.getPanes();
    currentPanes[paneId].isVisible = true;

    const currentPanesArr = getVisiblePanes(currentPanes);
    const wasHiddenFromRight = currentPanes[paneId].hiddenFromSide === "right";
    if (wasHiddenFromRight) currentPanesArr.reverse();

    const sortedByClosestToTargetPane = sortByClosestToPane(
      currentPanesArr,
      paneId,
    );

    logInfo("Container width", state.containerWidth);
    const emptySpace =
      state.containerWidth -
      sortedByClosestToTargetPane.reduce((acc, curr) => (acc += curr.width), 0);
    sortedByClosestToTargetPane.length &&
      getNewPanesWidthToAccomodateReaddedPanes(
        currentPanes[paneId],
        sortedByClosestToTargetPane,
        emptySpace,
      ).forEach((updatedPane) => {
        currentPanes[updatedPane.id].width = updatedPane.width;
      });

    this.setPanes(currentPanes);
  },
  showPane(paneId) {
    const panes = this.getPanes();
    panes[paneId].isVisible = true;
    this.setPanes(panes);
  },
  hidePane(paneId) {
    if (!state.activePaneId) {
      throw new Error(
        "hidePane can only be called during interaction. Use hidePaneManually to hide panes without interaction.",
      );
    }
    const currentPanes = this.getPanes();
    currentPanes[paneId].hiddenFromSide =
      state.activePaneId === paneId ? "right" : "left";

    const currentPanesArr = getVisiblePanes(currentPanes);
    const wasHiddenFromRight = currentPanes[paneId].hiddenFromSide === "right";
    if (wasHiddenFromRight) currentPanesArr.reverse();

    const sortedByClosestToTargetPane = sortByClosestToPane(
      currentPanesArr,
      paneId,
    );

    const { width, minWidth } = currentPanes[paneId];
    const freedUpSpace = width || minWidth;

    sortedByClosestToTargetPane.length &&
      getNewPanesWidthToFillVacuumAfterPaneIsHidden(
        freedUpSpace,
        sortedByClosestToTargetPane,
      ).forEach((updatedPane) => {
        currentPanes[updatedPane.id].width = updatedPane.width;
      });

    currentPanes[paneId].width = currentPanes[paneId]
      .widthAtStartOfInteraction as number;
    currentPanes[paneId].isVisible = false;
    this.setPanes(currentPanes);
  },
  hidePaneManually(paneId) {
    const currentPanes = this.getPanes();
    const isFirstVisiblePane = getVisiblePanes(currentPanes)[0]?.id === paneId;
    currentPanes[paneId].hiddenFromSide = isFirstVisiblePane ? "right" : "left";

    const currentPanesArr = getVisiblePanes(currentPanes);
    const wasHiddenFromRight = currentPanes[paneId].hiddenFromSide === "right";
    if (wasHiddenFromRight) currentPanesArr.reverse();

    const sortedByClosestToTargetPane = sortByClosestToPane(
      currentPanesArr,
      paneId,
    );

    const { width, minWidth } = currentPanes[paneId];
    const freedUpSpace = width || minWidth;

    sortedByClosestToTargetPane.length &&
      getNewPanesWidthToFillVacuumAfterPaneIsHidden(
        freedUpSpace,
        sortedByClosestToTargetPane,
      ).forEach((updatedPane) => {
        currentPanes[updatedPane.id].width = updatedPane.width;
      });

    currentPanes[paneId].isVisible = false;
    this.setPanes(currentPanes);
  },
  setActivePane(paneId) {
    state.activePaneId = paneId;
    this.updateWidthsAtStartOfInteraction();
  },
  updateWidthsAtStartOfInteraction() {
    const panes = this.getPanes();
    Object.values(panes).forEach((pane: Pane) => {
      pane.widthAtStartOfInteraction = pane.width;
    });
    this.setPanes(panes);
  },
  setPixelsTravelled(pixels) {
    state.pixelsTravelled = pixels;
  },
  setContainerWidth(width) {
    state.containerWidth = width;
  },
  handleContainerResize(containerSize, widthUsedFromContent) {
    if (!state.containerWidth || state.activePaneId) return;
    const panes = this.getPanes();
    const difference = containerSize - state.containerWidth;// - overflownValue;
    if (difference === 0) return;

    const visiblePanes = getVisiblePanes(panes);
    const [isShrinking, isGrowing] = [difference < 0, difference > 0];
    this.setContainerWidth(containerSize);
    if (isGrowing && containerSize < widthUsedFromContent) {
      logInfo("Container is growing. Content will be expanding.");
    } else if (isShrinking && containerSize < widthUsedFromContent) {
      logInfo("Content is overflowing. Container is shrinking.");
    }

    if (isShrinking) {
      getNewPanesWidthToAccomodateContainerShrinking(
        visiblePanes,
        Math.abs(difference),
      ).forEach((updatedPane) => {
        panes[updatedPane.id] = {
          ...panes[updatedPane.id],
          ...updatedPane,
        };
      });
    } else if (isGrowing) {
      getNewPanesWidthToAccommodateContainerGrowing(
        visiblePanes,
        difference,
      ).forEach((updatedPane) => {
        panes[updatedPane.id] = {
          ...panes[updatedPane.id],
          ...updatedPane,
        };
      });
    }
    this.setPanes(panes);
  },
  resetInteractionState() {
    state.activePaneId = null;
    state.pixelsTravelled = 0;
  },
  resetState() {
    this.setPanes({});
    this.setContainerWidth(0);
    this.resetInteractionState();
  },
});

export const createContext = () => {
  const state = createState();
  const actions = createActions(state);
  return { state, ...actions };
};
