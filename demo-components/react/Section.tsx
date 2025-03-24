import '../styles/Section.scss';
type SectionProps = React.HTMLAttributes<HTMLDivElement> & { // used to allow for implicit passing of HTML attributes like style
  maxWidth?: string;
  contentStyle?: React.CSSProperties;
};

const Section: React.FC<SectionProps> = ({
  maxWidth = "clamp(100px, 90cqw, 800px)",
  contentStyle,
  children,
  ...rest // also used for implicit passing of attributes
}) => {
  return (
    <div className="demo-section" {...rest}>
      <div className="demo-section__container" style={{ maxWidth: maxWidth }}>
        <div className="demo-section__content" style={contentStyle}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Section;
