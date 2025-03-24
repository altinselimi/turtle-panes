import Panes from "@turtle-panes/react";
import '@turtle-panes/react/style'

import Section from "./Section.tsx";
import '../styles/CustomDividerDemo.scss';

const CustomDividerDemo: React.FC = () => {
  const panesStyle = {
    margin: "20px 0px",
    borderRadius: "20px",
    backgroundColor: "var(--white)",
    height: "40cqw",
  };


  const divWidth =  {
    width: "30cqw",
  }

  return (
    <Section
      contentStyle={{ alignItems: "flex-start" }}
    >
      <div
        className="turtle-panes__section-description"
      >
        <h1 className="turtle-panes__heading">Custom divider ?</h1>
        <p className="turtle-panes__description">We got you covered.</p>
      </div>
      <Panes style={panesStyle}>
        <Panes.Pane
          divider={
            <Panes.Divider>
              {" "}
              <div className="turtle-panes__custom-divider">🐢</div>
            </Panes.Divider>
          }
        >
          <div
            style={divWidth}
            className="turtle-panes__demo-box"
          ></div>
        </Panes.Pane>
        <Panes.Pane
          divider={
            <Panes.Divider>
              {" "}
              <div className="turtle-panes__custom-divider">🏎️</div>
            </Panes.Divider>
          }
        >
          <div
            style={divWidth}
            className="turtle-panes__demo-box"
          ></div>
        </Panes.Pane>
        <Panes.Pane>
          <div
            style={divWidth}
            className="turtle-panes__demo-box"
          ></div>
        </Panes.Pane>
      </Panes>
    </Section>
  );
};

export default CustomDividerDemo;
