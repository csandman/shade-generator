import { useState, useEffect } from 'react';
import useOnline from 'hooks/use-online';
import { useSidebar } from 'contexts/sidebar-context';
import KofiButton from 'Components/KofiButton';
import HelpMenu from './HelpMenu/HelpMenu';
import ColorHistory from './ColorHistory/ColorHistory';
import TopColors from './TopColors/TopColors';
import ColorNameMenu from './ColorNameMenu/ColorNameMenu';
import './Sidebar.scss';

const initialMenuStates = {
  isMainMenuOpen: true,
  isHistoryMenuOpen: false,
  isSearchMenuOpen: false,
  isTopColorsMenuOpen: false,
  isHelpMenuOpen: false,
};

const Sidebar = ({ handleColorClick = () => {} }) => {
  const { isMenuOpen, closeMenu } = useSidebar();

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Escape') {
        closeMenu();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const online = useOnline();
  const [menuStates, updateMenuStates] = useState(initialMenuStates);

  const openMenu = (menuId) => {
    const newMenuStates = {
      ...initialMenuStates,
      isMainMenuOpen: false,
    };
    newMenuStates[`is${menuId}Open`] = true;
    updateMenuStates(newMenuStates);
  };

  const closeSubMenu = () => {
    document.activeElement.blur();
    updateMenuStates({ ...initialMenuStates });
  };

  const [firestoreMenuLoad, setFirestoreMenuLoad] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      setFirestoreMenuLoad(true);
    }
  }, [isMenuOpen, setFirestoreMenuLoad]);

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
            <i className="icon fas fa-history" />
            <span>History</span>
          </div>
          {online && (
            <div
              className="main-menu-item"
              id="TopColorsMenu"
              onClick={(e) => openMenu(e.currentTarget.id)}
            >
              <i className="icon fas fa-award" />
              <span>Top Colors</span>
            </div>
          )}
          <div
            className="main-menu-item"
            id="SearchMenu"
            onClick={(e) => openMenu(e.currentTarget.id)}
          >
            <i className="icon fas fa-search" />
            <span>Search Colors</span>
          </div>
          <div
            className="main-menu-item"
            id="HelpMenu"
            onClick={(e) => openMenu(e.currentTarget.id)}
          >
            <i className="icon fas fa-question-circle" />
            <span>What is this?</span>
          </div>
          <div className="footer-row">
            <a
              href="https://github.com/csandman/shade-generator"
              rel="noopener noreferrer"
              target="_blank"
              aria-label="Link to github repository"
            >
              <i className="icon fab fa-github" />
            </a>
            <a
              href="https://ko-fi.com/D1D513LDD"
              rel="noopener noreferrer"
              target="_blank"
              aria-label="Support me on Ko-fi"
            >
              <KofiButton className="icon " height="42" />
            </a>
          </div>
        </div>
        <div
          className={`sub-menu${menuStates.isHistoryMenuOpen ? '' : ' hidden'}`}
        >
          <div onClick={closeSubMenu} className="sub-menu-header">
            <i className="icon fas fa-arrow-left" />
            <span>Color History</span>
          </div>
          <div className="sub-menu-content">
            <ColorHistory handleColorClick={handleColorClick} />
          </div>
        </div>

        <div
          className={`sub-menu${
            menuStates.isTopColorsMenuOpen ? '' : ' hidden'
          }`}
        >
          <div onClick={closeSubMenu} className="sub-menu-header">
            <i className="icon fas fa-arrow-left" />
            <span>Top Colors</span>
          </div>
          <div className="sub-menu-content">
            {firestoreMenuLoad && (
              <TopColors handleColorClick={handleColorClick} />
            )}
          </div>
        </div>

        <div
          className={`sub-menu${menuStates.isSearchMenuOpen ? '' : ' hidden'}`}
          id="color-search-menu"
        >
          <div onClick={closeSubMenu} className="sub-menu-header">
            <i className="icon fas fa-arrow-left" />
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
            <i className="icon fas fa-arrow-left" />
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
