import { createContext } from "./context";
import { Pane, ContextType } from "../types";
import { describe, beforeEach, it, expect } from "vitest";

export const getDefaultPane = (id: number): Pane => ({
  width: 100,
  minWidth: 50,
  hideOnMinWidthExceeded: true,
  preventContentOverflow: true,
  isVisible: true,
  id: id,
  isFlex: false,
});

describe("Context", () => {
  let context: ContextType;

  beforeEach(() => {
    context = createContext();
  });

  it("should add a new pane and assign an id to it", async () => {
    await context.addPane({
      ...getDefaultPane(1),
      id: null,
    });
    await context.addPane({
      ...getDefaultPane(1),
      id: null,
      width: 150,
    });

    expect(Object.keys(context.state.panes).length).toBe(2);
    expect(context.state.panes[1].width).toBe(100);
    expect(context.state.panes[2].width).toBe(150);
  });

  it("should update a pane's properties correctly", () => {
    context.setPanes({
      1: getDefaultPane(1),
    });
    context.updatePane(1, { width: 150 });

    expect(context.state.panes[1].width).toBe(150);
  });

  it("should set container width correctly", () => {
    context.setContainerWidth(300);

    expect(context.state.containerWidth).toBe(300);
  });

  it("should reset interaction state correctly", () => {
    context.setActivePane(1);
    context.setPixelsTravelled(50);
    context.resetInteractionState();

    expect(context.state.activePaneId).toBeNull();
    expect(context.state.pixelsTravelled).toBe(0);
  });

  it("should reset the entire state correctly", () => {
    context.setPanes({
      1: getDefaultPane(1),
    });
    context.setContainerWidth(300);
    context.setActivePane(1);
    context.setPixelsTravelled(50);
    context.resetState();

    expect(Object.keys(context.state.panes).length).toBe(0);
    expect(context.state.containerWidth).toBe(0);
    expect(context.state.activePaneId).toBeNull();
    expect(context.state.pixelsTravelled).toBe(0);
  });

  it("on interaction start -> should update widthAtStartOfInteraction for all panes", () => {
    context.setPanes({
      1: getDefaultPane(1),
      2: getDefaultPane(2),
    });
    context.setActivePane(1);

    expect(context.state.panes[1].widthAtStartOfInteraction).toBe(100);
    expect(context.state.panes[2].widthAtStartOfInteraction).toBe(100);
  });
  describe("hiding and reshowing panes", () => {
    it("when a pane is hidden from its own divider -> should distribute width appropriately to closest siblings", () => {
      context.setPanes({
        1: getDefaultPane(1),
        2: getDefaultPane(2),
        3: getDefaultPane(3),
        4: getDefaultPane(4),
      });
      context.setContainerWidth(400);
      context.setActivePane(2);
      context.hidePane(2);

      expect(context.state.panes[3].width).toBe(200);
    });
    it("when a pane is manually hidden -> should distribute width appropriately to closest siblings ", () => {
      context.setPanes({
        1: getDefaultPane(1),
        2: getDefaultPane(2),
        3: getDefaultPane(3),
        4: getDefaultPane(4),
      });
      context.setContainerWidth(400);
      context.hidePaneManually(4);

      expect(context.state.panes[3].width).toBe(200);

      context.reShowPane(4);
      expect(context.state.panes[4].width).toBe(100);

      context.hidePaneManually(1);
      expect(context.state.panes[2].width).toBe(200);
      context.reShowPane(1);
      expect(context.state.panes[2].width).toBe(100);

      context.hidePaneManually(3);
      expect(context.state.panes[2].width).toBe(200);
    });
    it("when a hidden pane is re-shown -> should allocate enough space to re-show it", () => {
      context.setPanes({
        1: getDefaultPane(1),
        2: getDefaultPane(2),
      });
      context.setContainerWidth(200);
      context.setActivePane(1);
      context.hidePaneManually(1);
      expect(context.state.panes[2].width).toBe(200);

      context.reShowPane(1);
      expect(context.state.panes[1].width).toBe(100);
      expect(context.state.panes[2].width).toBe(100);
    });
  });
});
