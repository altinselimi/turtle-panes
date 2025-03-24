import { PaneComponentProps } from "../types";

export const defaultPaneProps: PaneComponentProps = {
  minWidth: 10,
  initialWidth: undefined,
  maxWidth: undefined,
  hideOnMinWidthExceeded: false,
  preventContentOverflow: false,
  isVisible: true,
  isFlex: false,
  allowOverflow: false,
  hideDivider: false,
};
