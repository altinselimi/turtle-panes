import { SiGithub, SiNpm, SiBluesky } from "react-icons/si";
import Panes from "@turtle-panes/react";
import '@turtle-panes/react/style';

import Section from "./Section.tsx";
import DemoDivider from "./DemoDivider.tsx";
import '../styles/LettersDemo.scss';

const LettersDemo: React.FC = () => {
  return (
    <Section
      contentStyle={{ alignItems: "center" }}
    >
      <div
        className="demo-intro__logo"
        aria-label="logo with text TURTLE PANES"
      >
        <Panes style={{
          width: "100%",
          justifyContent: "center",
        }}>
          {["T", "U", "R", "T", "L", "E"].map((letter, index) => (
            <Panes.Pane
              key={index}
              divider={
                <Panes.Divider>
                  <DemoDivider />
                </Panes.Divider>
              }
            >
              <div className="demo-intro__logo-letter">{letter}</div>
            </Panes.Pane>
          ))}
        </Panes>
        <h1 className="demo-intro__logo-text">PANES</h1>
      </div>
      <p className="turtle-panes__description">
        Easily build and manage multi-pane views
      </p>
      <div className="turtle-panes__links demo-intro__links">
        <a href="">
          <SiGithub />
        </a>
        <a href="">
          <SiBluesky />
        </a>
        <a href="">
          <SiNpm />
        </a>
      </div>
    </Section>
  );
};

export default LettersDemo;
