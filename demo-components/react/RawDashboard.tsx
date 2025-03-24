import Panes from "@turtle-panes/react";
import '@turtle-panes/react/style'

import '../styles/RawDashboard.scss';

const RawDashboard: React.FC = () => {
  return (
    <Panes>
      <Panes.Pane
        maxWidth={250}
        hideOnMinWidthExceeded
        preventContentOverflow
        minWidth={100}
      >
        <div className="dashboard-demo__first-pane">
          <div className="is-placeholder" style={{ height: "40px" }}></div>
          <div style={{ height: "20px" }}></div>
          {[1, 2, 3, 4, 5].map((_) => (
            <div
              className="is-placeholder"
              style={{ height: "20px", marginBottom: "10px" }}
            ></div>
          ))}
          <div style={{ height: "20px" }}></div>
          <div className="is-placeholder" style={{ height: "20px" }}></div>
        </div>
      </Panes.Pane>
      <Panes.Pane minWidth={250} isFlex>
        <div style={{ padding: "10px", width: "100%" }}>
          <div className="is-placeholder" style={{ height: "100%" }}></div>
        </div>
      </Panes.Pane>
      <Panes.Pane minWidth={100} maxWidth={250} hideOnMinWidthExceeded>
        <div style={{ padding: "10px", width: "100%" }}>
          <div className="is-placeholder" style={{ height: "40px" }}></div>
        </div>
      </Panes.Pane>
      <Panes.Pane>
        <div style={{ padding: "10px", width: "100%" }}>
          <div className="is-placeholder" style={{ height: "100px" }}></div>
        </div>
      </Panes.Pane>
    </Panes>
  );
};

export default RawDashboard;