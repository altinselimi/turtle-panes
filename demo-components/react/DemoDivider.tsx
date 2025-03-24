import { ChevronLeft, ChevronRight } from "lucide-react";
import "../styles/DemoDivider.scss";

const DemoDivider: React.FC = () => {
  return (
    <div className="turtle-panes__demo-divider">
        <div className="turtle-panes__demo-divider-divider">
          <ChevronLeft />
          <ChevronRight />
        </div>
    </div>
  );
};

export default DemoDivider;
