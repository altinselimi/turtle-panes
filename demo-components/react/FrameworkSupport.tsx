import Section from "./Section.tsx";
import { SiReact, SiVuedotjs } from "react-icons/si";
import '../styles/FrameworkSupport.scss';

const FrameWorkSupport: React.FC = () => {
  return (
    <Section
      style={{ backgroundColor: "var(--white)" }}
      contentStyle={{ alignItems: "center" }}
    >
      <div
        className="turtle-panes__section-description"
      >
        <h1 className="turtle-panes__heading">Framework support</h1>
        <p className="turtle-panes__description">
          Turtle-Panes plays nicely with some of the major frameworks
        </p>
      </div>
      <div className="demo-framework-support__icons">
        < SiVuedotjs />
        < SiReact />
      </div>
    </Section>
  );
};

export default FrameWorkSupport;