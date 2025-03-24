import { FC, useMemo, useEffect, useState, useRef } from "react";
import { useStateContext } from "./react-state-adapter";
import Divider, { DividerProps } from "./Divider";
import { PaneComponentProps } from "@turtle-panes/core/types";
import { defaultPaneProps } from "@turtle-panes/core";
import * as React from "react";
import { useComputedHooks } from "./hooks/usePaneComputedHooks.react";

export interface PaneProps extends PaneComponentProps {
  children?: React.ReactNode;
  divider?: React.ReactElement<DividerProps>;
  style?: React.CSSProperties;
  id?: number;
}

const Pane: FC<PaneProps> = ({ children, style, id: propId, ...props }) => {
  props = { ...defaultPaneProps, ...props };

  const context = useStateContext();
  const [id, setId] = useState<number | null>(propId ?? null);
  const isAddedToContext = useRef<boolean>(false);
  const paneWrapperRef = useRef<HTMLDivElement | null>(null);
  const paneContentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isAddedToContext.current || id) return;
    isAddedToContext.current = true;

    const targetRef = props.isFlex ? paneWrapperRef : paneContentRef;
    const clientRect = targetRef.current?.getBoundingClientRect() || null;
    if (!clientRect) return;

    let newWidth = clientRect.width || props.minWidth || 0;
    if (props.minWidth != null && newWidth < props.minWidth) {
      newWidth = props.minWidth;
    } else if (props.maxWidth != null && newWidth > props.maxWidth) {
      newWidth = props.maxWidth;
    }

    const paneId = context.addPaneSync({
      width: props.initialWidth ? props.initialWidth : newWidth,
      minWidth: props.minWidth || 0,
      maxWidth: props.maxWidth,
      isVisible: props.isVisible || true,
      hideOnMinWidthExceeded: props.hideOnMinWidthExceeded,
      preventContentOverflow: props.preventContentOverflow,
      isFlex: props.isFlex || false,
      id,
    });

    setId(paneId);
  }, [id, props, context]);

  const { isPaneVisible, isContainerMounted, widthFromContext } =
    useComputedHooks(id, context);

  const classNames = useMemo(() => {
    const map: { [key: string]: boolean } = {
      "turtle-panes__pane": true,
      "is-hidden": !isPaneVisible && isContainerMounted,
      'is-visible': !!isPaneVisible && !!isContainerMounted,
      "is-flex": props.isFlex || false,
      [`pane-${id}`]: true,
    };
    return Object.keys(map)
      .filter((key) => map[key])
      .join(" ");
  }, [isPaneVisible, isContainerMounted, id]);

  const computedContentStyle = useMemo<React.CSSProperties>(() => {
    if (!id) {
      const initialStyles: React.CSSProperties = {
        minWidth: `${props.minWidth}px`,
      };
      if (props.maxWidth) initialStyles["maxWidth"] = `${props.maxWidth}px`;
      if (props.initialWidth)
        initialStyles["width"] = `${props.initialWidth}px`;

      return initialStyles;
    }

    const pane = context.state.panes[id];
    return {
      width: pane?.isVisible ? `${pane?.width}px` : "0px",
      visibility: pane?.isVisible ? "visible" : "hidden",
      overflow: props.allowOverflow ? "auto" : "hidden",
    };
  }, [id, props, isPaneVisible]);

  // TODO: better naming
  const styleToPreventFlexOvergrowingOnPaneReappearance =
    useMemo<React.CSSProperties>(() => {
      return props.isFlex && widthFromContext
        ? { maxWidth: `${widthFromContext}px` }
        : {};
    }, [props.isFlex, widthFromContext]);

  const combinedWrapperStyle = useMemo<React.CSSProperties>(() => {
    return { ...style, ...styleToPreventFlexOvergrowingOnPaneReappearance };
  }, [style, styleToPreventFlexOvergrowingOnPaneReappearance]);

  useEffect(() => {
    if(!id) return;
    const widthOfContent = paneContentRef.current?.scrollWidth || 0;
    const widthProvidedByPane = paneContentRef.current?.clientWidth || 0;
    context.updatePaneContentWidth(
      id as number,
      widthOfContent,
      widthProvidedByPane,
    );
  }, [context.state.pixelsTravelled, id]);

  return (
    <div
      className={classNames}
      ref={paneWrapperRef}
      style={combinedWrapperStyle}
    >
      <div
        className="turtle-panes__pane-content"
        ref={paneContentRef}
        style={computedContentStyle}
      >
        <div className="turtle-panes__pane-content-wrapper">{children}</div>
      </div>
      {props.divider ? (
        React.cloneElement(props.divider, { paneId: id })
      ) : (
        <Divider paneId={id} />
      )}
    </div>
  );
};

export default Pane;
