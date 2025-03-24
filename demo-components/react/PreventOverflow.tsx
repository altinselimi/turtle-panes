import Panes from "@turtle-panes/react";
import '@turtle-panes/react/style'

import Section from "./Section.tsx";
import '../styles/PreventOverflow.scss';

const PreventOverflow: React.FC = () => {
  return ( 
    <Section
      contentStyle={{ alignItems: "flex-start" }}
    >
      <div className="turtle-panes__section-description" style={{alignSelf: "flex-start"}}>
        <h1 className="turtle-panes__heading">Let the content decide</h1>
        <p className="turtle-panes__description">
          There is a prevent-overflow behavior you can use to make sure pane
          content is always visible.
        </p>
      </div>
      <Panes style={{margin: "40px 0px", borderRadius: "20px"}}>
        <Panes.Pane preventContentOverflow>
            <div className="turtle-panes__demo-box">
                <p style={{minWidth: "150px"}}>I will always be visible</p>
            </div>
        </Panes.Pane>
        <Panes.Pane>
            <div className="turtle-panes__demo-box">
                <p style={{minWidth: "150px"}}>I might be clipped at certain widths</p>
            </div>
        </Panes.Pane>
      </Panes>
    </Section>
  );
};

export default PreventOverflow;
