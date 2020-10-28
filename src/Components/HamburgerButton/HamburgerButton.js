import { memo, useContext } from 'react';
import SidebarContext from 'Contexts/SidebarContext';
import './HamburgerButton.scss';

const HamburgerButton = ({ color, className = '' }) => {
  const { isMenuOpen, toggleMenu } = useContext(SidebarContext);

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
