import { useState } from "react";
import RawDashboard from "./RawDashboard";
import LettersDemo from "./LettersDemo";
import PreventOverflow from "./PreventOverflow";
import FlexDemo from "./FlexDemo";
import HideDemo from "./HideDemo";
import CustomDividerDemo from "./CustomDividerDemo";
import UseItForDashboards from "./UseItForDashboards";
import UseItForImageComparison from "./UseItForImageComparison";
import "../styles/App.scss";
import "../style.css";
import FrameWorkSupport from "./FrameworkSupport";

const DemoWrapper: React.FC = () => {
  const [isTesting, setIsTesting] = useState(false);
  const isDev = process.env.NODE_ENV === "development"; 

  const handleDoubleClick = () => {
    if (isDev) {
      setIsTesting((prev) => !prev);
    }
  };

  return (
    <div
      className="turtle-panes__demo-wrapper"
      onDoubleClick={handleDoubleClick}
    >
      {isTesting ? (
        <RawDashboard /> 
      ) : (
        <>
          <LettersDemo />
          <UseItForDashboards />
          <UseItForImageComparison />
          <PreventOverflow />
          <HideDemo />
          <FlexDemo />
          <CustomDividerDemo />
          <FrameWorkSupport />
        </>
      )}
    </div>
  );
};

export default DemoWrapper;
