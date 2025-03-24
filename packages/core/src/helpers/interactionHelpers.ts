export const attachPaneDividerInteractionListeners = ({
  mouseMoveCallback,
  mouseUpCallback,
}: {
  mouseMoveCallback: (e: MouseEvent | TouchEvent) => void;
  mouseUpCallback: () => void;
}) => {
  const handleMouseUp = () => {
    mouseUpCallback();
    window.removeEventListener("mouseup", handleMouseUp as EventListener);
    window.removeEventListener("mousemove", mouseMoveCallback as EventListener);
    window.removeEventListener("dragstart", handleDragStart as EventListener);
    window.removeEventListener("touchend", handleMouseUp as EventListener);
    window.removeEventListener("touchmove", mouseMoveCallback as EventListener);
  };

  const handleDragStart = (event: Event) => {
    event.preventDefault(); // Disable the browser's default drag behavior.
  };

  window.addEventListener("mouseup", handleMouseUp as EventListener);
  window.addEventListener("mousemove", mouseMoveCallback as EventListener);
  window.addEventListener("dragstart", handleDragStart as EventListener);
  window.addEventListener("touchend", handleMouseUp as EventListener);
  window.addEventListener("touchmove", mouseMoveCallback as EventListener);
};

export const endInteraction = () => {
  window.dispatchEvent(new Event("mouseup"));
  window.dispatchEvent(new Event("touchend"));
};

export const convertReactEventToNative = (
  event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
): MouseEvent | TouchEvent => {
  if (event.nativeEvent instanceof MouseEvent) {
    return event.nativeEvent;
  } else if (event.nativeEvent instanceof TouchEvent) {
    return event.nativeEvent;
  }
  throw new Error("Unsupported event type");
};
