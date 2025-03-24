import Panes from "@turtle-panes/react";
import '@turtle-panes/react/style'

import Section from "./Section.tsx";
import Checkbox from "./Checkbox.tsx";
import { useRef, useMemo, useState } from "react";
import { ExposedFunctions } from "../../packages/core/src/types/index.ts";
import '../styles/UseItForDashboards.scss';

const UseItForDashboards: React.FC = () => {
  const panesRef = useRef<ExposedFunctions | null>(null);
  const panes = useMemo(() => {
    return [1, 2, 3, 4].map((id) => ({
      id,
      isChecked: true,
    }));
  }, [panesRef.current]);
  const [paneVisibilityState, setPaneVisibilityState] = useState(
    panes.map((p) => ({ id: p.id, value: true })),
  );

  const handlePaneCheckbox = (id: number, value: boolean) => {
    const cloned = structuredClone(paneVisibilityState);
    const idx = cloned.findIndex((p) => p.id === id);
    cloned[idx].value = value;
    setPaneVisibilityState(cloned);

    if (value) {
      panesRef.current?.reShowPane(id);
    } else {
      panesRef.current?.hidePane(id);
    }
  };

  const handleOnPanesHidden = (hiddenPaneIds: number[]) => {
    const cloned = structuredClone(paneVisibilityState);
    cloned.forEach((p) => {
      p.value = !hiddenPaneIds.includes(p.id);
    });
    setPaneVisibilityState(cloned);
  };

  return (
    <Section contentStyle={{ alignItems: "flex-start" }}>
      <div
        className="turtle-panes__section-description"
      >
        <h1 className="turtle-panes__heading">Use it to make dashboards</h1>
        <p className="turtle-panes__description">
          This library was inspired first and foremost for building multi pane
          dashboards.
        </p>
      </div>

      <Panes
        className="dashboard-demo__panes"
        ref={panesRef}
        onPanesHidden={handleOnPanesHidden}
      >
        <Panes.Pane isFlex hideOnMinWidthExceeded minWidth={50}>
          <div className="dashboard-demo__first-pane">
            <div className="is-placeholder" style={{ height: "40px" }}></div>
            <div style={{ height: "20px" }}></div>
            {[1, 2, 3, 4, 5].map((_, index) => (
              <div key={index}>
                <div
                  className="is-placeholder"
                  style={{ height: "20px", marginBottom: "10px" }}
                ></div>
              </div>
            ))}
            <div style={{ height: "20px" }}></div>
            <div className="is-placeholder" style={{ height: "20px" }}></div>
          </div>
        </Panes.Pane>

        <Panes.Pane minWidth={30} isFlex style={{ flex: 3 }}>
          <div style={{ padding: "10px", width: "100%" }}>
            <div className="is-placeholder" style={{ height: "100%" }}></div>
          </div>
        </Panes.Pane>

        <Panes.Pane isFlex minWidth={30} hideOnMinWidthExceeded>
          <div style={{ padding: "10px", width: "100%" }}>
            <div className="is-placeholder" style={{ height: "40px" }}></div>
            <div
              className="is-placeholder"
              style={{ height: "40px", marginTop: "20px" }}
            ></div>
          </div>
        </Panes.Pane>

        <Panes.Pane isFlex minWidth={30} hideOnMinWidthExceeded>
          <div style={{ padding: "10px", width: "100%" }}>
            <div className="is-placeholder" style={{ height: "40px" }}></div>
            <div
              className="is-placeholder"
              style={{ height: "40px", marginTop: "20px" }}
            ></div>
          </div>
        </Panes.Pane>
      </Panes>
      <div className="dashboard-demo__hide-manually">
        {paneVisibilityState.map((pane) => (
          <Checkbox
            key={pane.id}
            value={pane.value}
            onChange={(value) => handlePaneCheckbox(pane.id, value)}
          >
            Pane {pane.id}
          </Checkbox>
        ))}
      </div>
    </Section>
  );
};

export default UseItForDashboards;
