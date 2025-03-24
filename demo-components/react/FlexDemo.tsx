import Section from "./Section.tsx";
import Panes from "@turtle-panes/react";
import '@turtle-panes/react/style'

import '../styles/FlexDemo.scss';

const FlexDemo: React.FC = () => {
  return (
    <Section
      contentStyle={{ alignItems: "stretch" }}
    >
      <div
        className="turtle-panes__section-description"
      >
        <h1 className="turtle-panes__heading">Give it all the space</h1>
        <p className="turtle-panes__description" style={{maxWidth: '35ch'}}>
          You can let a pane breathe as much as it
          wants with flex='true'
        </p>
      </div>
      <Panes style={{ margin: "40px 0px", borderRadius: "20px" }}>
        <Panes.Pane isFlex>
          <div className="turtle-panes__demo-box">
            <p>I'll eat all i can</p>
          </div>
        </Panes.Pane>
        <Panes.Pane>
          <div className="turtle-panes__demo-box">
            <p>
              I'll take <br />
              what i need
            </p>
          </div>
        </Panes.Pane>
      </Panes>
    </Section>
  );
};

export default FlexDemo;