import { useState, useEffect } from 'react';
import { useSidebar } from 'contexts/sidebar-context';
import KofiButton from 'Components/KofiButton';
import HelpMenu from './HelpMenu';
import ColorHistory from './ColorHistory';
import ColorNameMenu from './ColorNameMenu';
import type { ColorCallback } from 'types/app';
import './Sidebar.scss';
import {
  FaArrowLeft,
  FaGithub,
  FaHistory,
  FaQuestionCircle,
  FaSearch,
} from 'react-icons/fa';

const initialMenuStates = {
  isMainMenuOpen: true,
  isHistoryMenuOpen: false,
  isSearchMenuOpen: false,
  isTopColorsMenuOpen: false,
  isHelpMenuOpen: false,
};

interface SidebarProps {
  handleColorClick: ColorCallback;
}

const Sidebar = ({ handleColorClick }: SidebarProps) => {
  const { isMenuOpen, closeMenu } = useSidebar();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        closeMenu();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [closeMenu]);

  const [menuStates, updateMenuStates] = useState(initialMenuStates);

  const openMenu = (menuId: string) => {
    const newMenuStates = {
      ...initialMenuStates,
      isMainMenuOpen: false,
    };
    newMenuStates[`is${menuId}Open` as keyof typeof newMenuStates] = true;
    updateMenuStates(newMenuStates);
  };

  const closeSubMenu = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    updateMenuStates({ ...initialMenuStates });
  };

  return (
    <div id="sidebar" className={isMenuOpen ? '' : 'hidden'}>
      <div className="sidebar-content">
        <div
          className={`main-menu-items${
            menuStates.isMainMenuOpen ? '' : ' hidden'
          }`}
        >
          <div
            className="main-menu-item"
            id="HistoryMenu"
            onClick={(e) => openMenu(e.currentTarget.id)}
          >
            <FaHistory className="icon" />
            <span>History</span>
          </div>
          <div
            className="main-menu-item"
            id="SearchMenu"
            onClick={(e) => openMenu(e.currentTarget.id)}
          >
            <FaSearch className="icon" />
            <span>Search Colors</span>
          </div>
          <div
            className="main-menu-item"
            id="HelpMenu"
            onClick={(e) => openMenu(e.currentTarget.id)}
          >
            <FaQuestionCircle className="icon" />
            <span>What is this?</span>
          </div>
          <div className="footer-row">
            <a
              href="https://github.com/csandman/shade-generator"
              rel="noopener noreferrer"
              target="_blank"
              aria-label="Link to github repository"
            >
              <FaGithub className="icon" />
            </a>
            <a
              href="https://ko-fi.com/D1D513LDD"
              rel="noopener noreferrer"
              target="_blank"
              aria-label="Support me on Ko-fi"
            >
              <KofiButton className="icon" height={42} />
            </a>
          </div>
        </div>
        <div
          className={`sub-menu${menuStates.isHistoryMenuOpen ? '' : ' hidden'}`}
        >
          <div onClick={closeSubMenu} className="sub-menu-header">
            <FaArrowLeft className="icon" />
            <span>Color History</span>
          </div>
          <div className="sub-menu-content">
            <ColorHistory handleColorClick={handleColorClick} />
          </div>
        </div>

        <div
          className={`sub-menu${menuStates.isSearchMenuOpen ? '' : ' hidden'}`}
          id="color-search-menu"
        >
          <div onClick={closeSubMenu} className="sub-menu-header">
            <FaArrowLeft className="icon" />
            <span>Search Colors</span>
          </div>
          <ColorNameMenu
            isOpen={menuStates.isSearchMenuOpen && isMenuOpen}
            handleColorClick={handleColorClick}
          />
        </div>

        <div
          className={`sub-menu${menuStates.isHelpMenuOpen ? '' : ' hidden'}`}
        >
          <div onClick={closeSubMenu} className="sub-menu-header">
            <FaArrowLeft className="icon" />
            <span>What is this?</span>
          </div>

          <div className="sub-menu-content">
            <HelpMenu />
          </div>
        </div>
      </div>
      <div className="background" onClick={closeMenu} />
    </div>
  );
};

export default Sidebar;
