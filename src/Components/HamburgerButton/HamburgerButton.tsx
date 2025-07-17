import { memo } from 'react';
import { useSidebar } from 'contexts/sidebar-context';
import './HamburgerButton.scss';

interface HamburgerButtonProps {
  color: string;
  className?: string;
}

const HamburgerButton = ({ color, className = '' }: HamburgerButtonProps) => {
  const { isMenuOpen, toggleMenu } = useSidebar();

  return (
    <button
      type="button"
      className={`hamburger-button ${className} ${isMenuOpen ? 'close' : ''}`}
      onClick={toggleMenu}
      title="Menu"
    >
      <span className="line" style={{ backgroundColor: color }} />
      <span className="line" style={{ backgroundColor: color }} />
      <span className="line" style={{ backgroundColor: color }} />
    </button>
  );
};

export default memo(HamburgerButton);
