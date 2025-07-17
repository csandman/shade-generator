import { useState, useEffect } from 'react';
import { useSidebar } from 'contexts/sidebar-context';
import { FaHistory, FaQuestionCircle, FaSearch } from 'react-icons/fa';
import type { ColorCallback } from 'types/app';
import HelpMenu from './HelpMenu';
import ColorHistory from './ColorHistory';
import ColorNameMenu from './ColorNameMenu';
import MainMenuItem from './MainMenuItem';
import SubMenu from './SubMenu';
import SidebarFooter from './SidebarFooter';
import './Sidebar.scss';

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

    globalThis.addEventListener('keydown', handleKeyPress);
    return () => {
      globalThis.removeEventListener('keydown', handleKeyPress);
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
          <MainMenuItem
            id="HistoryMenu"
            icon={FaHistory}
            label="History"
            onClick={openMenu}
          />
          <MainMenuItem
            id="SearchMenu"
            icon={FaSearch}
            label="Search Colors"
            onClick={openMenu}
          />
          <MainMenuItem
            id="HelpMenu"
            icon={FaQuestionCircle}
            label="What is this?"
            onClick={openMenu}
          />
          <SidebarFooter />
        </div>

        <SubMenu
          isOpen={menuStates.isHistoryMenuOpen}
          title="Color History"
          onBack={closeSubMenu}
        >
          <ColorHistory handleColorClick={handleColorClick} />
        </SubMenu>

        <SubMenu
          isOpen={menuStates.isSearchMenuOpen}
          title="Search Colors"
          onBack={closeSubMenu}
          id="color-search-menu"
        >
          <ColorNameMenu
            isOpen={menuStates.isSearchMenuOpen && isMenuOpen}
            handleColorClick={handleColorClick}
          />
        </SubMenu>

        <SubMenu
          isOpen={menuStates.isHelpMenuOpen}
          title="What is this?"
          onBack={closeSubMenu}
        >
          <HelpMenu />
        </SubMenu>
      </div>
      <div className="background" onClick={closeMenu} />
    </div>
  );
};

export default Sidebar;
