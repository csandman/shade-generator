import React, { useState, useContext } from "react";
import HelpMenu from "./HelpMenu/HelpMenu";
import ColorHistory from "./ColorHistory/ColorHistory";
import TopColors from "./TopColors/TopColors";
import KofiButton from "../KofiButton";
import ColorNameMenu from "./ColorNameMenu/ColorNameMenu";
import { useOnline } from "react-browser-hooks";
import "./Sidebar.scss";
import SidebarContext from "../../Contexts/SidebarContext";
import { useEventListener } from "../../Hooks";

const Sidebar = props => {
  const { isMenuOpen, closeMenu } = useContext(SidebarContext);

  function handleKeyPress(e) {
    console.log(e);
    if (e.code === "Escape") {
      closeMenu();
    }
  }
  useEventListener("keyup", handleKeyPress, document);

  const online = useOnline();
  const [menuStates, updateMenuStates] = useState({
    isMainMenuOpen: true,
    isHistoryMenuOpen: false,
    isSearchMenuOpen: false,
    isTopColorsMenuOpen: false,
    isHelpMenuOpen: false
  });

  const openMenu = menuId => {
    const newMenuStates = {};
    for (const key in menuStates) {
      newMenuStates[key] = false;
    }
    newMenuStates[`is${menuId}Open`] = true;
    updateMenuStates({ ...newMenuStates });
  };

  const closeSubMenu = () => {
    document.activeElement.blur();
    const newMenuStates = {};
    for (const key in menuStates) {
      newMenuStates[key] = false;
    }
    updateMenuStates({ ...newMenuStates, isMainMenuOpen: true });
  };

  return (
    <div id="sidebar" className={isMenuOpen ? "" : "hidden"}>
      <div className="sidebar-content">
        <div
          className={
            "main-menu-items" + (menuStates.isMainMenuOpen ? "" : " hidden")
          }
        >
          {online && (
            <div className="online-menu-items">
              <div
                className="main-menu-item"
                id="HistoryMenu"
                onClick={e => openMenu(e.currentTarget.id)}
              >
                <i className="icon fas fa-history" />
                <span>Color History</span>
              </div>
              <div
                className="main-menu-item"
                id="TopColorsMenu"
                onClick={e => openMenu(e.currentTarget.id)}
              >
                <i className="icon fas fa-award" />
                <span>Most Popular</span>
              </div>
            </div>
          )}
          <div
            className="main-menu-item"
            id="SearchMenu"
            onClick={e => openMenu(e.currentTarget.id)}
          >
            <i className="icon fas fa-search" />
            <span>Search Colors</span>
          </div>
          <div
            className="main-menu-item"
            id="HelpMenu"
            onClick={e => openMenu(e.currentTarget.id)}
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
          className={
            "sub-menu" + (menuStates.isHistoryMenuOpen ? "" : " hidden")
          }
        >
          <div onClick={closeSubMenu} className="sub-menu-header">
            <i className="icon fas fa-arrow-left" />
            <span>Color History</span>
          </div>
          <div className="sub-menu-content">
            <ColorHistory handleColorClick={props.handleColorClick} />
          </div>
        </div>

        <div
          className={
            "sub-menu" + (menuStates.isTopColorsMenuOpen ? "" : " hidden")
          }
        >
          <div onClick={closeSubMenu} className="sub-menu-header">
            <i className="icon fas fa-arrow-left" />
            <span>Most Popular</span>
          </div>
          <div className="sub-menu-content">
            <TopColors
              handleColorClick={props.handleColorClick}
              closeSidebar={props.closeSidebar}
            />
          </div>
        </div>

        <div
          className={
            "sub-menu" + (menuStates.isSearchMenuOpen ? "" : " hidden")
          }
          id="color-search-menu"
        >
          <div onClick={closeSubMenu} className="sub-menu-header">
            <i className="icon fas fa-arrow-left" />
            <span>Search Colors</span>
          </div>
          <ColorNameMenu
            handleColorClick={props.handleColorClick}
            closeSidebar={props.closeSidebar}
          />
        </div>

        <div
          className={"sub-menu" + (menuStates.isHelpMenuOpen ? "" : " hidden")}
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
