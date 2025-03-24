import {
  FC,
  useImperativeHandle,
  forwardRef,
  ReactNode,
  useEffect,
  useRef,
  useMemo,
} from "react";
import Pane, { PaneProps } from "./Pane";
import Divider, { DividerProps } from "./Divider";
import "./style.scss";
import { StateProvider, useStateContext } from "./react-state-adapter";
import { ExposedFunctions } from "@turtle-panes/core/types";
import { useComputedHooks } from "./hooks/usePaneComputedHooks.react";

interface PanesProps {
  children: ReactNode;
  style?: React.CSSProperties;
  className?: string;
  onPanesHidden?: (...args: any[]) => any;
  Panes?: FC<PaneProps>;
  Divider?: FC<DividerProps>;
}

const Panes = forwardRef<ExposedFunctions, PanesProps>((props, ref) => {
  return (
    <StateProvider>
      <PanesInner ref={ref} {...props} />
    </StateProvider>
  );
});

const PanesInner = forwardRef<ExposedFunctions, PanesProps>(
  ({ children, style, className, onPanesHidden }, ref) => {
    const panesWrapperRef = useRef<HTMLDivElement | null>(null);
    const context = useStateContext();
    const previousHiddenPanesRef = useRef<number[]>([]);
    const { isInteractingWithADivider } = useComputedHooks(null, context);

    let resizeObserver: ResizeObserver | null = null;
    const updateContainerWidthOnResize = () => {
      if (!panesWrapperRef.current || window.ResizeObserver === undefined)
        return;
      resizeObserver = new ResizeObserver((entries) => {
        const resizedPanesWrapperRef = entries.find(
          (entry: ResizeObserverEntry) =>
            entry.target.isSameNode(panesWrapperRef.current),
        );
        if (!resizedPanesWrapperRef) return;
        const { scrollWidth } = resizedPanesWrapperRef.target as HTMLElement;
        context.handleContainerResize(
          resizedPanesWrapperRef.contentRect.width,
          scrollWidth,
        );
      });

      resizeObserver.observe(panesWrapperRef.current as Element);
    };

    useEffect(() => {
      const wrapperElement = panesWrapperRef.current;
      const { width = 0 } = wrapperElement?.getBoundingClientRect() || {};
      context.setContainerWidth(width);
      updateContainerWidthOnResize();
      return () => {
        // TODO: this throws errors, figure out why
        // context.resetState();
        resizeObserver?.disconnect();
      };
    }, []);

    useEffect(() => {
      const currentHiddenPanes = Object.values(context.state.panes)
        .filter((pane) => !pane.isVisible)
        .map((pane) => pane.id);

      const prevHiddenPanes = previousHiddenPanesRef.current;
      const hasChanges =
        JSON.stringify(currentHiddenPanes) !== JSON.stringify(prevHiddenPanes);

      if (hasChanges) {
        previousHiddenPanesRef.current = currentHiddenPanes;
        onPanesHidden && onPanesHidden(currentHiddenPanes);
      }
    }, [context.state.panes]);

    const reShowPane = (id: number) => {
      if (context.state.panes[id].isVisible) return;
      context.reShowPane(id);
    };

    const hidePane = (id: number) => {
      if (!context.state.panes[id].isVisible) return;
      context.hidePaneManually(id);
    };

    const hiddenPanes = () => {
      return Object.values(context.state.panes).filter(
        (pane) => !pane.isVisible,
      );
    };

    useImperativeHandle(ref, () => ({
      reShowPane,
      hidePane,
      hiddenPanes,
    }));

    const classNames = useMemo(() => {
      return [
        "turtle-panes__wrapper",
        className,
        isInteractingWithADivider && "is-resizing",
      ].filter((i) => i);
    }, [isInteractingWithADivider]);

    return (
      <div ref={panesWrapperRef} style={style} className={classNames.join(" ")}>
        {children}
      </div>
    );
  },
);

Panes.displayName = "Panes";

// Define a type that includes both the component and the static properties
type PanesComponent = typeof Panes & {
  Pane: typeof Pane;
  Divider: typeof Divider;
};

// Assign static properties to Panes using Object.assign
Object.assign(Panes, {
  Pane,
  Divider,
});

export default Panes as PanesComponent;
