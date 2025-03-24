import { CheckCircle2 } from "lucide-react";
import '../styles/Checkbox.scss';

type CheckboxProps = {
  value: boolean;
  onChange: (value: boolean) => void;
  children?: React.ReactNode;
};

const Checkbox: React.FC<CheckboxProps> = ({
  value,
  onChange,
  children,
}) => {

  return (
    <div className="turtle-panes__checkbox">
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
      <CheckCircle2 />
      <span>{children}</span>
    </div>
  );
};

export default Checkbox;
