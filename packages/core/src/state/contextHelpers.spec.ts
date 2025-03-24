import { describe, it, expect } from "vitest";
import { Pane, PaneMap } from "../types";

import { getDefaultPane } from "./context.spec";
import {
  calculateNewWidthForPanes,
  getPaneSiblingId,
  sortByClosestToPane,
  getVisiblePanes,
  getNewPanesWidthToAccomodateReaddedPanes,
  getNewPanesWidthToFillVacuumAfterPaneIsHidden,
  getNewPanesWidthToAccomodateTargetShrinking,
  getNewPanesWidthToAccomodateTargetGrowing,
  getNewPanesWidthToAccomodateContainerShrinking,
  getNewPanesWidthToAccommodateContainerGrowing,
} from "./contextHelpers";

describe("contextHelpers", () => {
  describe("getNewPanesWidthToAccomodateTargetShrinking : When a target pane is shrinking, the ordered siblings should get their widths updated to fill up the freed-up space", () => {
    it("should distribute 100 pixels of freed-up space properly to the array of panes", () => {
      const panes: Pane[] = [
        { ...getDefaultPane(1), width: 100, maxWidth: 200 },
        { ...getDefaultPane(2), width: 150, maxWidth: 250 },
        { ...getDefaultPane(3), width: 200, maxWidth: 300 },
      ];
      const newSpaceAvailable = 100;

      const result = getNewPanesWidthToAccomodateTargetShrinking(
        panes,
        newSpaceAvailable,
      );

      expect(result).toEqual([{ id: 1, width: 200 }]);
    });

    it("should distribute remaining space to the next pane if giving all to one exceeds its maxWidth", () => {
      const panes: Pane[] = [
        { ...getDefaultPane(1), width: 100, maxWidth: 150 },
        { ...getDefaultPane(2), width: 150, maxWidth: 250 },
        { ...getDefaultPane(3), width: 200, maxWidth: 300 },
      ];
      const newSpaceAvailable = 100;

      const result = getNewPanesWidthToAccomodateTargetShrinking(
        panes,
        newSpaceAvailable,
      );

      expect(result).toEqual([
        { id: 1, width: 150 },
        { id: 2, width: 200 },
      ]);
    });
  });

  describe("getNewPanesWidthToAccomodateTargetGrowing : When a target pane is growing, the ordered siblings should get their widths updated to provide the required space", () => {
    it("should take 100 pixels of space properly from the array of panes", () => {
      const panes: Pane[] = [
        { ...getDefaultPane(1), width: 200, minWidth: 100 },
        { ...getDefaultPane(2), width: 250, minWidth: 150 },
        { ...getDefaultPane(3), width: 300, minWidth: 200 },
      ];
      const spaceNeeded = 100;

      const result = getNewPanesWidthToAccomodateTargetGrowing(
        panes,
        spaceNeeded,
      );

      expect(result).toEqual([{ id: 1, width: 100 }]);
    });

    it("should take remaining space from the next pane if taking all from one exceeds its minWidth", () => {
      const panes: Pane[] = [
        { ...getDefaultPane(1), width: 150, minWidth: 100 },
        { ...getDefaultPane(2), width: 250, minWidth: 150 },
        { ...getDefaultPane(3), width: 300, minWidth: 200 },
      ];
      const spaceNeeded = 100;

      const result = getNewPanesWidthToAccomodateTargetGrowing(
        panes,
        spaceNeeded,
      );

      expect(result).toEqual([
        { id: 1, width: 100 },
        { id: 2, width: 200 },
      ]);
    });

    it("should throw an error if there is not enough space to accommodate the target pane growing", () => {
      const panes: Pane[] = [
        { ...getDefaultPane(1), width: 150, minWidth: 150 },
        { ...getDefaultPane(2), width: 250, minWidth: 250 },
        { ...getDefaultPane(3), width: 300, minWidth: 300 },
      ];
      const spaceNeeded = 100;

      expect(() =>
        getNewPanesWidthToAccomodateTargetGrowing(panes, spaceNeeded),
      ).toThrow("Not enough space to accommodate the target pane growing");
    });
  });
  describe("calculateNewWidthForPanes : When dragging divider, two panes will have their widths updated", () => {
    it("should calculate new widths correctly", () => {
      const targetPane: Pane = getDefaultPane(1);
      const siblingPane: Pane = {
        ...getDefaultPane(2),
        width: 200,
      };
      const newWidth = 150;

      const result = calculateNewWidthForPanes(
        targetPane,
        siblingPane,
        newWidth,
      );

      expect(result).toEqual({
        targetPane: {
          ...targetPane,
          width: 150,
          isVisible: true,
        },
        siblingPane: {
          ...siblingPane,
          width: 150,
          isVisible: true,
        },
      });
    });

    it("should respect minWidth and maxWidth constraints", () => {
      const targetPane: Pane = {
        ...getDefaultPane(1),
        maxWidth: 120,
      };
      const siblingPane: Pane = {
        ...getDefaultPane(2),
        width: 200,
      };
      const newWidth = 130;

      const result = calculateNewWidthForPanes(
        targetPane,
        siblingPane,
        newWidth,
      );

      expect(result).toEqual({
        targetPane: {
          ...targetPane,
          width: 120,
          isVisible: true,
        },
        siblingPane: {
          ...siblingPane,
          width: 180,
          isVisible: true,
        },
      });
    });

    it("should apply correctionDifference when new width is less than minWidth", () => {
      const targetPane: Pane = {
        ...getDefaultPane(1),
        width: 150,
        minWidth: 100,
        maxWidth: 300,
      };
      const siblingPane: Pane = {
        ...getDefaultPane(2),
        width: 200,
        minWidth: 100,
        maxWidth: 300,
      };
      const newWidth = 80; // Less than targetPane.minWidth

      const result = calculateNewWidthForPanes(
        targetPane,
        siblingPane,
        newWidth,
      );

      expect(result).toEqual({
        targetPane: {
          ...targetPane,
          width: 100,
          isVisible: false,
        },
        siblingPane: {
          ...siblingPane,
          width: 350,
          isVisible: true,
        },
      });
    });

    it("should apply correctionDifference when new width is more than maxWidth", () => {
      const targetPane: Pane = {
        ...getDefaultPane(1),
        width: 150,
        minWidth: 100,
        maxWidth: 200,
      };
      const siblingPane: Pane = {
        ...getDefaultPane(2),
        width: 200,
        minWidth: 100,
        maxWidth: 300,
      };
      const newWidth = 250; // More than targetPane.maxWidth

      const result = calculateNewWidthForPanes(
        targetPane,
        siblingPane,
        newWidth,
      );

      expect(result).toEqual({
        targetPane: {
          ...targetPane,
          width: 200,
          isVisible: true,
        },
        siblingPane: {
          ...siblingPane,
          width: 150,
          isVisible: true,
        },
      });
    });
    it("should return unallocatedSpace when maxWidth is reached and correction can't be applied anymore", () => {
      const targetPane: Pane = {
        ...getDefaultPane(1),
        width: 200,
        minWidth: 100,
        maxWidth: 300,
        hideOnMinWidthExceeded: true,
      };
      const siblingPane: Pane = {
        ...getDefaultPane(2),
        width: 100,
        minWidth: 100,
        maxWidth: 200,
      };
      const newWidth = 50;

      expect(
        calculateNewWidthForPanes(targetPane, siblingPane, newWidth),
      ).toEqual({
        targetPane: {
          ...targetPane,
          width: 100,
          isVisible: false,
        },
        siblingPane: {
          ...siblingPane,
          width: 200,
          isVisible: true,
        },
        undistributedSpace: 100,
      });
    });

    it("should use content width as minWidth when preventContentOverflow is true and content is overflowing", () => {
      const targetPane: Pane = {
        ...getDefaultPane(1),
        width: 200,
        minWidth: 50,
        widthOfContent: 200,
        widthProvidedByPane: 199,
        preventContentOverflow: true,
        hideOnMinWidthExceeded: false
      };
      const siblingPane: Pane = {
        ...getDefaultPane(2),
        width: 200,
      };

      const result = calculateNewWidthForPanes(
        targetPane,
        siblingPane,
        190,
      );

      expect(result).toEqual({
        targetPane: {
          ...targetPane,
          width: 200, // Should use widthOfContent as minimum
        },
        siblingPane: {
          ...siblingPane,
          width: 200,
        },
      });
    });

    it("should not use content width as minWidth when preventContentOverflow is false", () => {
      const targetPane: Pane = {
        ...getDefaultPane(1),
        width: 200,
        minWidth: 50,
        widthOfContent: 150,
        widthProvidedByPane: 100,
        preventContentOverflow: false,
      };
      const siblingPane: Pane = {
        ...getDefaultPane(2),
        width: 200,
      };
      const newWidth = 80;

      const result = calculateNewWidthForPanes(
        targetPane,
        siblingPane,
        newWidth,
      );

      expect(result).toEqual({
        targetPane: {
          ...targetPane,
          width: 80, // Should use requested width since it's above minWidth
          isVisible: true,
        },
        siblingPane: {
          ...siblingPane,
          width: 320,
          isVisible: true,
        },
      });
    });

    it("should not use content width if it's smaller than minWidth", () => {
      const targetPane: Pane = {
        ...getDefaultPane(1),
        width: 200,
        minWidth: 100,
        widthOfContent: 80,
        widthProvidedByPane: 60,
        preventContentOverflow: true,
        hideOnMinWidthExceeded: false,
      };
      const siblingPane: Pane = {
        ...getDefaultPane(2),
        preventContentOverflow: true,
        hideOnMinWidthExceeded: false,
        width: 200,
      };
      const newWidth = 50;

      const result = calculateNewWidthForPanes(
        targetPane,
        siblingPane,
        newWidth,
      );

      expect(result).toEqual({
        targetPane: {
          ...targetPane,
          width: 100, // Should use minWidth since it's larger than content width
          isVisible: true,
        },
        siblingPane: {
          ...siblingPane,
          width: 300,
          isVisible: true,
        },
      });
    });

    it("should not use content width if it's smaller than provided width", () => {
      const targetPane: Pane = {
        ...getDefaultPane(1),
        width: 200,
        minWidth: 50,
        widthOfContent: 120,
        widthProvidedByPane: 150,
        preventContentOverflow: true,
      };
      const siblingPane: Pane = {
        ...getDefaultPane(2),
        width: 200,
      };
      const newWidth = 80;

      const result = calculateNewWidthForPanes(
        targetPane,
        siblingPane,
        newWidth,
      );

      expect(result).toEqual({
        targetPane: {
          ...targetPane,
          width: 80, // Should use requested width since content is narrower than provided width
          isVisible: true,
        },
        siblingPane: {
          ...siblingPane,
          width: 320,
          isVisible: true,
        },
      });
    });

    it("should ignore content width when widthOfContent is undefined", () => {
      const targetPane: Pane = {
        ...getDefaultPane(1),
        width: 200,
        minWidth: 50,
        widthProvidedByPane: 150,
        preventContentOverflow: true,
      };
      const siblingPane: Pane = {
        ...getDefaultPane(2),
        width: 200,
      };
      const newWidth = 80;

      const result = calculateNewWidthForPanes(
        targetPane,
        siblingPane,
        newWidth,
      );

      expect(result).toEqual({
        targetPane: {
          ...targetPane,
          width: 80, // Should use requested width since content width is undefined
          isVisible: true,
        },
        siblingPane: {
          ...siblingPane,
          width: 320,
          isVisible: true,
        },
      });
    });
  });

  describe("getPaneSiblingId : Used in multiple functions to get the sibling of a pane (to its left, or right)", () => {
    it("should return the correct sibling id", () => {
      const panes: Pane[] = [
        getDefaultPane(1),
        {
          ...getDefaultPane(2),
          width: 200,
        },
        {
          ...getDefaultPane(3),
          width: 300,
        },
      ];

      expect(getPaneSiblingId(2, panes, "left")).toBe(1);
      expect(getPaneSiblingId(2, panes, "right")).toBe(3);
    });

    it("should return null if there is no sibling", () => {
      const panes: Pane[] = [
        getDefaultPane(1),
        {
          ...getDefaultPane(2),
          width: 200,
        },
      ];

      expect(getPaneSiblingId(1, panes, "left")).toBeNull();
      expect(getPaneSiblingId(2, panes, "right")).toBeNull();
    });
  });

  describe("sortByClosestToPane : Used when hiding or re-showing panes to distribute freed up width, or allocate new width", () => {
    it("should sort panes by closest to target pane", () => {
      const panes: Pane[] = [
        getDefaultPane(1),
        {
          ...getDefaultPane(2),
          width: 200,
        },
        {
          ...getDefaultPane(3),
          width: 300,
        },
        {
          ...getDefaultPane(4),
          width: 400,
        },
      ];

      const result = sortByClosestToPane(panes, 2);

      expect(result.map((pane) => pane.id)).toEqual([1, 3, 4]);
    });

    it("should throw an error if target pane is not visible", () => {
      const panes: Pane[] = [
        getDefaultPane(1),
        {
          ...getDefaultPane(3),
          width: 300,
        },
      ];

      expect(() => sortByClosestToPane(panes, 2)).toThrow(
        "Pane to be compared with is not visible",
      );
    });
  });

  describe("getVisiblePanes : Used to make calculations based on visible panes", () => {
    it("should return only visible panes", () => {
      const panes: PaneMap = {
        1: getDefaultPane(1),
        2: {
          ...getDefaultPane(2),
          isVisible: false,
        },
        3: getDefaultPane(3),
      };

      const result = getVisiblePanes(panes);

      expect(result.map((pane) => pane.id)).toEqual([1, 3]);
    });
  });

  describe("getNewPanesWidthToAccomodateReaddedPanes : When a pane is re-added, there needs to be new space allocated", () => {
    it("should return panes that need updating widths for accomodating new pane", () => {
      const panes: Pane[] = [
        getDefaultPane(1),
        {
          ...getDefaultPane(2),
          width: 200,
        },
        {
          ...getDefaultPane(3),
          width: 300,
        },
        {
          ...getDefaultPane(4),
          isVisible: false,
        },
      ];
      const paneToBeReadded = panes[3];

      paneToBeReadded.isVisible = true;
      const sortedByClosestToTargetPane = sortByClosestToPane(panes, 4);
      const result = getNewPanesWidthToAccomodateReaddedPanes(
        paneToBeReadded,
        sortedByClosestToTargetPane,
      );

      expect(result).toEqual([{ id: 3, width: 200 }]);
    });

    it("if preferred width (last known) of readded pane cannot be accomodated, it should use its minWidth", () => {
      const panes: Pane[] = [
        {
          ...getDefaultPane(1),
          width: 100,
          minWidth: 50,
        },
        {
          ...getDefaultPane(2),
          width: 100,
          minWidth: 100,
        },
        {
          ...getDefaultPane(3),
          width: 100,
          minWidth: 100,
        },
        {
          ...getDefaultPane(4),
          width: 100,
          isVisible: false,
          minWidth: 50,
        },
      ];
      const paneToBeReadded = panes[3];

      paneToBeReadded.isVisible = true;
      const sortedByClosestToTargetPane = sortByClosestToPane(panes, 4);
      const result = getNewPanesWidthToAccomodateReaddedPanes(
        paneToBeReadded,
        sortedByClosestToTargetPane,
      );

      expect(result).toEqual([
        { id: 1, width: 50 },
        { id: 4, width: 50 },
      ]);
    });

    it("if there is empty space in the container, it should utilize that to fit the preferred size of the readded pane", () => {
      const panes: Pane[] = [
        {
          ...getDefaultPane(1),
          width: 100,
          minWidth: 50,
        },
        {
          ...getDefaultPane(2),
          width: 100,
          minWidth: 100,
        },
        {
          ...getDefaultPane(3),
          width: 100,
          minWidth: 100,
        },
        {
          ...getDefaultPane(4),
          width: 100,
          isVisible: false,
          minWidth: 50,
        },
      ];
      const paneToBeReadded = panes[3];

      paneToBeReadded.isVisible = true;
      const sortedByClosestToTargetPane = sortByClosestToPane(panes, 4);
      const result = getNewPanesWidthToAccomodateReaddedPanes(
        paneToBeReadded,
        sortedByClosestToTargetPane,
        50,
      );

      expect(result).toEqual([{ id: 1, width: 50 }]);
    });

    it("if there is empty space in the container enough for preferred size, it should not re-size other panes", () => {
      const panes: Pane[] = [
        {
          ...getDefaultPane(1),
          width: 100,
          minWidth: 50,
        },
        {
          ...getDefaultPane(2),
          width: 100,
          minWidth: 100,
        },
        {
          ...getDefaultPane(3),
          width: 100,
          minWidth: 100,
        },
        {
          ...getDefaultPane(4),
          width: 100,
          isVisible: false,
          minWidth: 50,
        },
      ];
      const paneToBeReadded = panes[3];

      paneToBeReadded.isVisible = true;
      const sortedByClosestToTargetPane = sortByClosestToPane(panes, 4);
      const result = getNewPanesWidthToAccomodateReaddedPanes(
        paneToBeReadded,
        sortedByClosestToTargetPane,
        100,
      );

      expect(result).toEqual([]);
    });

    it("should throw an error if there is not enough space to readd the pane", () => {
      const panes: Pane[] = [
        getDefaultPane(1),
        {
          ...getDefaultPane(2),
          width: 100,
          minWidth: 100,
        },
        {
          ...getDefaultPane(3),
          width: 100,
          minWidth: 100,
        },
        {
          ...getDefaultPane(4),
          isVisible: false,
          minWidth: 100,
        },
      ];

      const paneToBeReadded = panes[3];
      paneToBeReadded.isVisible = true;
      const sortedByClosestToTargetPane = sortByClosestToPane(panes, 4);
      expect(() =>
        getNewPanesWidthToAccomodateReaddedPanes(
          paneToBeReadded,
          sortedByClosestToTargetPane,
        ),
      ).toThrow("Not enough space to readd the pane");
    });

    it("should throw an error if any of the panes passed are not visible", () => {
      const panes: Pane[] = [
        getDefaultPane(1),
        {
          ...getDefaultPane(2),
        },
        {
          ...getDefaultPane(3),
          width: 300,
        },
        {
          ...getDefaultPane(4),
          isVisible: false,
        },
      ];

      expect(() =>
        getNewPanesWidthToAccomodateReaddedPanes(panes[3], panes),
      ).toThrow(
        "Panes passed to getNewPanesWidthToAccomodateReaddedPanes must all be visible",
      );
    });
  });

  describe("getNewPanesWidthToFillVacuumAfterPaneIsHidden : When a pane is hidden, the space needs to be distributed to its siblings", () => {
    it("should calculate new widths to fill vacuum after pane is hidden", () => {
      const panes: Pane[] = [
        getDefaultPane(1),
        {
          ...getDefaultPane(2),
          width: 200,
        },
        {
          ...getDefaultPane(3),
          width: 300,
        },
      ];
      const freedUpSpace = 100;
      const sortedByClosestToTargetPane = sortByClosestToPane(panes, 1);

      const panesThatNeedUpdates =
        getNewPanesWidthToFillVacuumAfterPaneIsHidden(
          freedUpSpace,
          sortedByClosestToTargetPane,
        );

      expect(panesThatNeedUpdates).toEqual([{ id: 2, width: 300 }]);
    });

    it("should throw an error if any of the panes passed are not visible", () => {
      const panes: Pane[] = [
        getDefaultPane(1),
        {
          ...getDefaultPane(2),
          isVisible: false,
        },
        {
          ...getDefaultPane(3),
          width: 300,
        },
      ];
      const freedUpSpace = 100;

      expect(() =>
        getNewPanesWidthToFillVacuumAfterPaneIsHidden(freedUpSpace, panes),
      ).toThrow(
        "Panes passed to getNewPanesWidthToFillVacuumAfterPaneIsHidden must all be visible",
      );
    });
  });

  describe("getNewPanesWidthToAccomodateContainerShrinking: When the container is shrinking, the panes need to adjust their widths", () => {
    it("should calculate new widths for panes to accomodate container shrinking", () => {
      const panes: Pane[] = [
        getDefaultPane(1),
        {
          ...getDefaultPane(2),
        },
        {
          ...getDefaultPane(3),
        },
      ];
      const difference = 20;

      const newPanes = getNewPanesWidthToAccomodateContainerShrinking(
        panes,
        difference,
      );

      expect(newPanes).toEqual([{ id: 3, width: 80 }]);
    });

    it("should hide a pane if hideOnMinWidth is true, and give that width to its sibling, which then gets reduced", () => {
      const panes: Pane[] = [
        getDefaultPane(1),
        {
          ...getDefaultPane(2),
        },
        {
          ...getDefaultPane(3),
        },
      ];
      const difference = 80;

      const newPanes = getNewPanesWidthToAccomodateContainerShrinking(
        panes,
        difference,
      );

      expect(newPanes).toEqual([
        {
          id: 2,
          width: 120,
        },
        { id: 3, width: 50, isVisible: false },
        // On first iteration, we attempt to remove 100 from 3
        // But minWidth is 50, so we remove 50 and then set its isVisible to false
        // hiding it and giving the remaining 50 to 2
        // and then continuing to remove the remaining 30 from 2
      ]);
    });
  });

  describe("getNewPanesWidthToAccommodateContainerGrowing: When the container is growing, the panes need to adjust their widths", () => {
    it("should spread added space from middle out", () => {
      const panes: Pane[] = [
        getDefaultPane(1),
        {
          ...getDefaultPane(2),
        },
        {
          ...getDefaultPane(3),
        },
      ];
      const addedWidth = 20;

      const newPanes = getNewPanesWidthToAccommodateContainerGrowing(
        panes,
        addedWidth,
      );

      expect(newPanes).toEqual([{ id: 2, width: 120 }]);
    });

    it("should prioritize flex panes over non-flex panes when growing", () => {
      const panes: Pane[] = [
        getDefaultPane(1),
        {
          ...getDefaultPane(2),
        },
        {
          ...getDefaultPane(3),
          isFlex: true,
        },
      ];
      const addedWidth = 20;

      const newPanes = getNewPanesWidthToAccommodateContainerGrowing(
        panes,
        addedWidth,
      );

      expect(newPanes).toEqual([{ id: 3, width: 120 }]);
    });

    it("should spread width over the next pane if maxWidth is reached", () => {
      const panes: Pane[] = [
        getDefaultPane(1),
        {
          ...getDefaultPane(2),
          maxWidth: 150,
        },
        {
          ...getDefaultPane(3),
        },
      ];
      const addedWidth = 100;

      const newPanes = getNewPanesWidthToAccommodateContainerGrowing(
        panes,
        addedWidth,
      );

      expect(newPanes).toEqual([
        { id: 2, width: 150 },
        { id: 3, width: 150 },
      ]);
    });
  });
});
