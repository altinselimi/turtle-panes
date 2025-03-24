import { FC, useRef } from "react";
import { useStateContext } from "./react-state-adapter";
import { attachPaneDividerInteractionListeners, useLogs } from "@turtle-panes/core";
const { logError } = useLogs();

export interface DividerProps {
  paneId?: number | null;
  children?: React.ReactNode;
}

const Divider: FC<DividerProps> = ({ children, ...props }) => {
  const dividerRef = useRef<HTMLDivElement | null>(null);
  const clientXOnMouseDown = useRef<number | null>(null);
  const isDraggingToGrowth = useRef<boolean | null>(null);
  const context = useStateContext();

  if (!context) {
    throw new Error("Pane is not wrapped in Panes component");
  }

  const getMouseClientX = (e: MouseEvent | TouchEvent): number => {
    if (e instanceof MouseEvent) {
      return e.clientX;
    }
    return e.touches[0].clientX;
  };

  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    const eClientX = getMouseClientX(e);
    const movementFromStart = Math.abs(
      eClientX - (clientXOnMouseDown.current as number),
    );
    const dividerRect = dividerRef.current?.getBoundingClientRect();
    const mouseMoveStartThreshold = (dividerRect?.width || 0) / 2;
    const isInteractingWithDivider =
      context.state.activePaneId && context.state.activePaneId === props.paneId;
    if (
      !isInteractingWithDivider ||
      movementFromStart < mouseMoveStartThreshold
    )
      return;
    try {
      isDraggingToGrowth.current = true;
      const dividerClientX = (dividerRect?.left || 0) + mouseMoveStartThreshold;
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

  const handleMouseUp = () => {
    isDraggingToGrowth.current = null;
    context.resetInteractionState();
  };

  const handleMouseDown = (e: MouseEvent | TouchEvent) => {
    const isInteractingWithAnotherDivider =
      context.state.activePaneId && context.state.activePaneId !== props.paneId;
    if (isInteractingWithAnotherDivider) return;
    context.setActivePane(props.paneId as number);
    clientXOnMouseDown.current = getMouseClientX(e);

    if (window.getSelection) {
      window.getSelection()?.removeAllRanges();
    }

    attachPaneDividerInteractionListeners({
      mouseMoveCallback: handleMouseMove,
      mouseUpCallback: handleMouseUp,
    });
  };

  return (
    <div className="turtle-panes__divider-wrapper">
      {!children ? (
        <div
          ref={dividerRef}
          onMouseDown={(e) => handleMouseDown(e.nativeEvent)}
          onTouchStart={(e) => handleMouseDown(e.nativeEvent)}
          className="turtle-panes__divider-target"
          data-testid={`divider-${props.paneId}`}
        ></div>
      ) : (
        <div
          ref={dividerRef}
          onMouseDown={(e) => handleMouseDown(e.nativeEvent)}
          onTouchStart={(e) => handleMouseDown(e.nativeEvent)}
          className="turtle-panes__divider-custom"
          data-testid={`divider-${props.paneId}`}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default Divider;
