export type Pane = {
  width: number;
  minWidth: number;
  maxWidth?: number;
  isVisible?: boolean;
  isFlex: boolean;
  id: number;
  visiblePaneIndex?: number;
  hiddenFromSide?: "left" | "right";
  widthAtStartOfInteraction?: number;
  widthOfContent?: number;
  widthProvidedByPane?: number;
  hideOnMinWidthExceeded?: boolean;
  preventContentOverflow?: boolean;
  isOverflowing?: boolean;
};

export type PaneWithId = Pane & { id: number };

export type PartialPaneWithId = Partial<Pane> & { id: number };

export type PaneComponentProps = {
  minWidth?: Pane["minWidth"];
  initialWidth?: number;
  maxWidth?: Pane["maxWidth"];
  hideOnMinWidthExceeded?: Pane["hideOnMinWidthExceeded"];
  preventContentOverflow?: Pane["preventContentOverflow"];
  isVisible?: Pane["isVisible"];
  isFlex?: boolean;
  allowOverflow?: boolean;
  hideDivider?: boolean;
};

export interface PaneMap {
  [id: number]: Pane;
}
export interface ContextState {
  state: {
    panes: PaneMap;
    containerWidth: number;
    activePaneId?: number | null;
    pixelsTravelled: number;
  };
}

export interface ContextAsyncMethods {
  addPane: (
    pane: Omit<Pane, "id"> & { id: Pane["id"] | null },
  ) => Promise<number>;
}
export interface ContextSyncMethods {
  getPanes: () => PaneMap;
  getNextId: () => number;
  setPanes: (newPanes: { [id: Pane["id"]]: Pane }) => void;
  addPaneSync: (pane: Omit<Pane, "id"> & { id: Pane["id"] | null }) => number;
  reShowPane: (paneId: Pane["id"]) => void;
  updatePane: (paneId: Pane["id"], newProps: Partial<Pane>) => void;
  showPane: (paneId: Pane["id"]) => void;
  hidePane: (paneId: Pane["id"]) => void;
  hidePaneManually: (paneId: Pane["id"]) => void;
  setActivePane: (paneId: Pane["id"]) => void;
  setPixelsTravelled: (pixelsTravelled: number) => void;
  updateWidthsAtStartOfInteraction: () => void;
  updatePaneWidth: (paneId: Pane["id"], newWidth: number) => void;
  updatePaneContentWidth: (paneId: Pane["id"], widthOfContent: number, widthProvidedByPane: number) => void;
  updatePaneWidthAlternate?: (paneId: Pane["id"], newWidth: number) => void;
  setContainerWidth: (width: number) => void;
  handleContainerResize: (
    width: number,
    widthUsedFromContent: number,
  ) => void;
  resetInteractionState: () => void;
  resetState: () => void;
}

export interface ContextMethods
  extends ContextAsyncMethods,
    ContextSyncMethods {}

export interface ContextType extends ContextState, ContextMethods {}

export interface ExposedFunctions {
  reShowPane: (paneId: Pane["id"]) => void;
  hidePane: (paneId: Pane["id"]) => void;
  hiddenPanes: () => Pane[];
}

export interface PaneWithUpdatedWidth {
  id: Pane["id"];
  width: number;
}
