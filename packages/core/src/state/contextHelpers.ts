import {
  Pane,
  PaneMap,
  PaneWithUpdatedWidth,
  PartialPaneWithId,
} from "../types";
import { useLogs } from "../helpers/useLogs";
const { logError, logInfo } = useLogs();

export const getNewPanesWidthToAccomodateTargetShrinking = (
  sortedByClosestToTargetPane: Pane[],
  newSpaceAvailable: number,
): PaneWithUpdatedWidth[] => {
  const panesThatNeedUpdates = [];
  let filledUpSpace = 0;
  for (const pane of sortedByClosestToTargetPane) {
    const remainingSpaceToBeFilled = newSpaceAvailable - filledUpSpace;
    const { width, maxWidth, id } = pane;
    const newPaneWidth = maxWidth
      ? Math.min(width + remainingSpaceToBeFilled, maxWidth)
      : width + remainingSpaceToBeFilled;
    panesThatNeedUpdates.push({
      id,
      width: newPaneWidth,
    });
    filledUpSpace += newPaneWidth - width;
    if (filledUpSpace === newSpaceAvailable) break;
  }
  return panesThatNeedUpdates;
};

export const getNewPanesWidthToAccomodateTargetGrowing = (
  sortedByClosestToTargetPane: Pane[],
  newSpaceRequired: number,
): PaneWithUpdatedWidth[] => {
  const panesThatNeedUpdates = [];
  let widthFilled = 0;
  for (const pane of sortedByClosestToTargetPane) {
    const remainingSpaceToBeAdded = newSpaceRequired - widthFilled;
    const { width, minWidth, id } = pane;
    const newPaneWidth = Math.max(width - remainingSpaceToBeAdded, minWidth);
    panesThatNeedUpdates.push({
      id,
      width: newPaneWidth,
    });
    widthFilled += width - newPaneWidth;
    if (widthFilled === newSpaceRequired) break;
  }
  if (widthFilled < newSpaceRequired) {
    throw new Error("Not enough space to accommodate the target pane growing");
  }
  return panesThatNeedUpdates;
};

export const calculateNewWidthForPanes = (
  targetPane: Pane,
  siblingPane: Pane,
  newWidth: number,
): {
  targetPane: Pane;
  siblingPane: Pane;
  undistributedSpace?: number;
} => {
  const pixelsDiffFromLastWidth = newWidth - targetPane.width;

  const [targetPaneProposedNewWidth, siblingPaneProposedNewWidth] = [
    targetPane.width + pixelsDiffFromLastWidth,
    siblingPane.width - pixelsDiffFromLastWidth,
  ];

  const updatedPanes = [
    {
      ...targetPane,
      proposedNewWidth: targetPaneProposedNewWidth,
      correctionDifference: 0,
    },
    {
      ...siblingPane,
      proposedNewWidth: siblingPaneProposedNewWidth,
      correctionDifference: 0,
    },
  ].map((pane) => {
    const useContentWidthAsMinWidth =
      pane.preventContentOverflow &&
      pane.widthOfContent &&
      pane.widthProvidedByPane &&
      pane.widthOfContent > pane.widthProvidedByPane &&
      pane.widthOfContent > pane.minWidth;
    const minWidth = useContentWidthAsMinWidth
      ? pane.widthOfContent!
      : pane.minWidth;
    if (pane.proposedNewWidth < minWidth) {
      pane.correctionDifference = pane.proposedNewWidth - minWidth;
      pane.proposedNewWidth = minWidth;
      if (pane.hideOnMinWidthExceeded) {
        pane.isVisible = false;
        pane.correctionDifference += pane.proposedNewWidth;
      }
    }
    if (pane.maxWidth != null && pane.proposedNewWidth > pane.maxWidth) {
      pane.correctionDifference = pane.proposedNewWidth - pane.maxWidth;
      pane.proposedNewWidth = pane.maxWidth;
    }
    return pane;
  });

  const correctedPane = updatedPanes.find(
    (pane) => pane.correctionDifference !== 0,
  );
  const toBeAdjustedPane = updatedPanes.find(
    (pane) => pane.correctionDifference === 0,
  );
  if (correctedPane && toBeAdjustedPane) {
    toBeAdjustedPane.proposedNewWidth += correctedPane.correctionDifference;
  }

  const [oldTotalWidth, newTotalWidth] = [
    updatedPanes.reduce((acc, curr) => acc + curr.width, 0),
    updatedPanes
      .filter((p) => p.isVisible)
      .reduce((acc, curr) => acc + curr.proposedNewWidth, 0),
  ];

  // when panes get hidden upon minWidth, total width can be less (if the other pane has a maxWidth)
  const undistributedSpace = oldTotalWidth - newTotalWidth;

  const result = {
    targetPane: {
      ...targetPane,
      width: updatedPanes[0].proposedNewWidth,
      isVisible: updatedPanes[0].isVisible,
    },
    siblingPane: {
      ...siblingPane,
      width: updatedPanes[1].proposedNewWidth,
      isVisible: updatedPanes[1].isVisible,
    },
  };
  return undistributedSpace ? { ...result, undistributedSpace } : result;
};

export const getPaneSiblingId = (
  paneId: Pane["id"],
  visiblePanes: Pane[],
  direction: "left" | "right",
) => {
  const paneIndex = visiblePanes.findIndex((p) => p.id === paneId);
  return visiblePanes[paneIndex + (direction === "left" ? -1 : 1)]?.id || null;
};

export const sortByClosestToPane = (panes: Pane[], paneId: Pane["id"]) => {
  const panesWithVisibleIndex: Pane[] = panes.map((pane, idx) => ({
    ...pane,
    visiblePaneIndex: idx,
  }));
  const targetVisibleIndex = panesWithVisibleIndex.find(
    (pane) => pane.id === paneId,
  )?.visiblePaneIndex;
  if (targetVisibleIndex == null) {
    throw new Error("Pane to be compared with is not visible");
  }
  return panesWithVisibleIndex
    .filter((_, idx) => targetVisibleIndex !== idx)
    .sort((a, b) => {
      return (
        Math.abs(a.visiblePaneIndex! - targetVisibleIndex!) -
        Math.abs(b.visiblePaneIndex! - targetVisibleIndex!)
      );
    });
};

export const getVisiblePanes = (panes: PaneMap): Pane[] => {
  const paneValues: Pane[] = Object.values(JSON.parse(JSON.stringify(panes)));
  return paneValues
    .filter((pane) => pane.isVisible)
    .sort((a, b) => a.id - b.id);
};

export const getNewPanesWidthToAccomodateReaddedPanes = (
  paneToBeReadded: Pane,
  sortedByClosestToTargetPane: Pane[],
  emptySpace: number = 0,
): PaneWithUpdatedWidth[] => {
  if (sortedByClosestToTargetPane.some((p) => !p.isVisible)) {
    throw new Error(
      "Panes passed to getNewPanesWidthToAccomodateReaddedPanes must all be visible",
    );
  }
  const { width: requiredWidth, minWidth: requiredMinWidth } = paneToBeReadded;
  let allocatedWidthForReaddingPane = emptySpace;
  const updatedVisiblePanes = [];
  for (let i = 0; i < sortedByClosestToTargetPane.length; i++) {
    const remainingAllocationNeeded =
      requiredWidth - allocatedWidthForReaddingPane;
    const toHaveWidthUpdatedPane = sortedByClosestToTargetPane[i];
    const { width, minWidth, id } = toHaveWidthUpdatedPane;
    const proposedNewWidth = Math.max(
      width - remainingAllocationNeeded,
      minWidth,
    );
    allocatedWidthForReaddingPane += width - proposedNewWidth;
    proposedNewWidth !== width &&
      updatedVisiblePanes.push({
        id,
        width: proposedNewWidth,
      });
    if (allocatedWidthForReaddingPane >= requiredWidth) break;
  }
  if (
    allocatedWidthForReaddingPane >= requiredMinWidth &&
    allocatedWidthForReaddingPane !== requiredWidth
  ) {
    updatedVisiblePanes.push({
      id: paneToBeReadded.id,
      width: allocatedWidthForReaddingPane,
    });
  }

  if (allocatedWidthForReaddingPane < requiredMinWidth) {
    throw new Error("Not enough space to readd the pane");
  }

  return updatedVisiblePanes;
};

export const getNewPanesWidthToFillVacuumAfterPaneIsHidden = (
  freedUpSpace: number,
  sortedByClosestToTargetPane: Pane[],
): PaneWithUpdatedWidth[] => {
  if (sortedByClosestToTargetPane.some((p) => !p.isVisible)) {
    throw new Error(
      "Panes passed to getNewPanesWidthToFillVacuumAfterPaneIsHidden must all be visible",
    );
  }
  const panesThatNeedUpdates = [];
  let filledUpSpace = 0;
  for (let i = 0; i < sortedByClosestToTargetPane.length; i++) {
    const remainingFreeSpace = freedUpSpace - filledUpSpace;
    const pane = sortedByClosestToTargetPane[i];
    const { width, maxWidth, id } = pane;
    let newPaneWidth = maxWidth
      ? Math.min(width + remainingFreeSpace, maxWidth)
      : width + remainingFreeSpace;
    panesThatNeedUpdates.push({
      id,
      width: newPaneWidth,
    });
    filledUpSpace += newPaneWidth - width;
    if (filledUpSpace === freedUpSpace) break;
  }

  return panesThatNeedUpdates;
};

export const getNewPanesWidthToAccomodateContainerShrinking = (
  visiblePanes: Pane[],
  widthRemovedFromContainer: number,
): PartialPaneWithId[] => {
  const panesFromRight = [...visiblePanes].reverse();
  const panesThatNeedUpdates: { [key: number]: PartialPaneWithId } = {};
  let removedSpace = 0;
  let remainingSpaceToBeRemoved = widthRemovedFromContainer;
  for (let idx in panesFromRight) {
    const pane = panesFromRight[parseInt(idx)];
    remainingSpaceToBeRemoved = widthRemovedFromContainer - removedSpace;
    const { width, minWidth, id, hideOnMinWidthExceeded } = pane;
    let proposedNewPaneWidth = width - remainingSpaceToBeRemoved;
    const newPaneWidth = Math.max(proposedNewPaneWidth, minWidth);
    panesThatNeedUpdates[id] = {
      id,
      width: newPaneWidth,
    };
    if (hideOnMinWidthExceeded && proposedNewPaneWidth < minWidth) {
      panesThatNeedUpdates[id].isVisible = false;
      panesFromRight[parseInt(idx) + 1].width += minWidth;
      removedSpace += width - minWidth;
    } else removedSpace += width - newPaneWidth;
    if (removedSpace >= widthRemovedFromContainer) break;
  }
  if (removedSpace > widthRemovedFromContainer) {
    logError("Removed too much space.");
  } else  {
    logInfo('Necessary space to remove', widthRemovedFromContainer);
    logInfo('Removed space', removedSpace);
  }
  return Object.values(panesThatNeedUpdates);
};

const sortByMiddleOut = <T>(items: T[]): T[] => {
  const middleIndex = Math.floor(items.length / 2);
  const sortedItems: T[] = [];

  for (let i = 0; i < items.length; i++) {
    const isEvenIndex = i % 2 === 0;
    const offset = Math.floor((i + 1) / 2);
    const index = middleIndex + (isEvenIndex ? -offset : offset);
    sortedItems.push(items[index]);
  }

  return sortedItems;
};

export const getNewPanesWidthToAccommodateContainerGrowing = (
  visiblePanes: Pane[],
  widthAddedToContainer: number,
): PaneWithUpdatedWidth[] => {
  const panesThatNeedUpdates: { [key: number]: PaneWithUpdatedWidth } = {};
  let widthFilled = 0;

  // Separate panes into flex and non-flex groups
  const flexPanes = sortByMiddleOut(visiblePanes.filter((pane) => pane.isFlex));
  const nonFlexPanes = sortByMiddleOut(
    visiblePanes.filter((pane) => !pane.isFlex),
  );

  // Reorder panes: flex first (middle-out), then non-flex (middle-out)
  const panesInOrder = [...flexPanes, ...nonFlexPanes];

  // Distribute the added width
  for (const pane of panesInOrder) {
    const remainingSpaceToBeAdded = widthAddedToContainer - widthFilled;
    if (remainingSpaceToBeAdded <= 0) break;
    const { width, maxWidth, id } = pane;
    let newPaneWidth = Math.min(
      width + remainingSpaceToBeAdded,
      maxWidth || Infinity,
    );

    panesThatNeedUpdates[id] = {
      id,
      width: newPaneWidth,
    };

    widthFilled += newPaneWidth - width;
    if (widthFilled >= widthAddedToContainer) break;
  }

  if (widthFilled < widthAddedToContainer) {
    logError("Too much space left");
    // throw new Error("Too much space to add to panes");
  }

  return Object.values(panesThatNeedUpdates);
};

export function getObjectDifferences(obj1: any, obj2: any): any {
  function compareObjects(o1: any, o2: any): any {
    const diffs: any = {};

    for (const key in o1) {
      if (o1.hasOwnProperty(key)) {
        if (
          typeof o1[key] === "object" &&
          o1[key] !== null &&
          !Array.isArray(o1[key])
        ) {
          const nestedDiffs = compareObjects(o1[key], o2[key]);
          if (Object.keys(nestedDiffs).length > 0) {
            diffs[key] = nestedDiffs;
          }
        } else if (o1[key] !== o2[key]) {
          diffs[key] = { old: o1[key], new: o2[key] };
        }
      }
    }

    for (const key in o2) {
      if (o2.hasOwnProperty(key) && !o1.hasOwnProperty(key)) {
        diffs[key] = { old: undefined, new: o2[key] };
      }
    }

    return diffs;
  }

  return compareObjects(obj1, obj2);
}
