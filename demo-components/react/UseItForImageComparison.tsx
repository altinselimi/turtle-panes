import Panes from "@turtle-panes/react";
import '@turtle-panes/react/style'

import Section from "./Section.tsx";
import "../styles/UseItForImageComparison.scss";

const UseItForImageComparison: React.FC = () => {
  const panesStyle: React.CSSProperties = {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
  };

  const leftImgSource = "/old-mustang.png";
  const leftImgInitialWidth =
    document.body.clientWidth > 768 ? 300 : document.body.clientWidth / 2;

  const rightImgSource = "/restored-old-mustang.png";

  return (
    <Section contentStyle={{ alignItems: "stretch" }}>
      <div className="turtle-panes__section-description">
        <h1 className="turtle-panes__heading">Or compare images</h1>
        <p className="turtle-panes__description">Its all up to you really</p>
      </div>
      <div className="before-after__wrapper">
        <img src={leftImgSource} className="bottom-image" />
        <Panes className="turtle-panes__wrapper" style={panesStyle}>
          <Panes.Pane initialWidth={leftImgInitialWidth}>
          </Panes.Pane>
          <Panes.Pane isFlex>
            <div className="before-after__after-container">
              <img src={rightImgSource} className="top-image" />
            </div>
          </Panes.Pane>
        </Panes>
      </div>
    </Section>
  );
};

export default UseItForImageComparison;
