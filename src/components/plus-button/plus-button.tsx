import './plus-button.scss';

interface PlusButtonProps {
  className?: string;
  open?: boolean;
  color?: string;
}

const PlusButton = ({ className, open, color }: PlusButtonProps) => (
  <div className={`plus-button ${className} ${open ? 'close' : ''}`}>
    <span className="line" style={{ backgroundColor: color }} />
    <span className="line" style={{ backgroundColor: color }} />
  </div>
);

export default PlusButton;
