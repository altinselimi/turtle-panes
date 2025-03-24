import Panes from "@turtle-panes/react";
import '@turtle-panes/react/style'

import Section from "./Section.tsx";
import type { ExposedFunctions } from "../../packages/core/src/types/index.ts";
import { useRef, useState } from "react";
import "../styles/HideDemo.scss";

const HideDemo: React.FC = () => {
  const turtlePanesRef = useRef<ExposedFunctions | null>(null);
  const [isPaneHidden, setIsPaneHidden] = useState(false);

  const panesStyle = {
    margin: "40px 0px",
    borderRadius: "20px",
  };

  return (
    <Section contentStyle={{ alignItems: "flex-start" }}>
      <div
        className="turtle-panes__section-description"
        style={{ color: "white" }}
      >
        <h1 className="turtle-panes__heading">Or maybe hide it?</h1>
        <p className="turtle-panes__description">
          Once a pane reaches its min-width, you can also choose to hide it.
        </p>
        <button
          onClick={() => turtlePanesRef.current?.reShowPane(1)}
          style={{ opacity: isPaneHidden ? 1 : 0 }}
        >
          Reset
        </button>
      </div>
      <Panes
        ref={turtlePanesRef}
        style={panesStyle}
        onPanesHidden={(hiddenPaneIds) =>
          setIsPaneHidden(!!hiddenPaneIds?.length)
        }
      >
        <Panes.Pane minWidth={120} hideOnMinWidthExceeded>
          <div className="turtle-panes__demo-box">
            <p>If you don’t want me I’ll just leave</p>
          </div>
        </Panes.Pane>
        <Panes.Pane minWidth={100}>
          <div className="turtle-panes__demo-box">
            <p>My min width is very important to me</p>
          </div>
        </Panes.Pane>
      </Panes>
    </Section>
  );
};

export default HideDemo;
