import React, { useContext } from 'react';
import './HamburgerButton.scss';
import SidebarContext from '../../Contexts/SidebarContext';

const HamburgerButton = ({ color, className = '' }) => {
  const { isMenuOpen, toggleMenu } = useContext(SidebarContext);

  return (
    <button
      type="button"
      className={`hamburger-button ${className} ${isMenuOpen ? 'close' : ''}`}
      onClick={toggleMenu}
    >
      <span className="line" style={{ backgroundColor: color }} />
      <span className="line" style={{ backgroundColor: color }} />
      <span className="line" style={{ backgroundColor: color }} />
    </button>
  );
};

export default React.memo(HamburgerButton);
