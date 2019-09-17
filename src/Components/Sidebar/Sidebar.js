import React, { useState } from "react";
import namedColors from "color-name-list";
import HelpMenu from "./HelpMenu/HelpMenu";
import ColorHistory from "./ColorHistory/ColorHistory";
import TopColors from "./TopColors/TopColors";
import KofiButton from "../KofiButton";
import { useOnline } from "react-browser-hooks";
import "./Sidebar.scss";

import { getContrastColor, hexToRgb } from "../../Functions";

const Sidebar = props => {
  const online = useOnline();

  const getInitialColorNameList = () => {
    return namedColors.slice(0, 200).map(el => {
      el.contrast = getContrastColor(hexToRgb(el.hex));
      return el;
    });
  };

  const [searchInput, updateSearchInput] = useState("");
  const [colorNameList, updateColorNameList] = useState(
    getInitialColorNameList()
  );
  const [menuStates, updateMenuStates] = useState({
    isMainMenuOpen: true,
    isHistoryMenuOpen: false,
    isSearchMenuOpen: false,
    isTopColorsMenuOpen: false,
    isHelpMenuOpen: false
  });

  const searchColorNames = e => {
    updateSearchInput(e.target.value);
    let newColorArr = [];
    let index = 0;
    while (newColorArr.length < 200 && index < namedColors.length) {
      if (
        namedColors[index].name
          .replace(/\s/g, "")
          .toLowerCase()
          .indexOf(e.target.value.replace(/\s/g, "").toLowerCase()) >= 0
      ) {
        newColorArr.push(namedColors[index]);
      }
      index++;
    }
    newColorArr.map(el => {
      el.contrast = getContrastColor(hexToRgb(el.hex));
      return el;
    });
    updateColorNameList(newColorArr);
  };

  const openColorHistory = () => {
    const newMenuStates = Object.keys(menuStates).forEach(
      key => (menuStates[key] = false)
    );
    updateMenuStates({ ...newMenuStates, isHistoryMenuOpen: true });
  };

  const openTopColorsMenu = () => {
    const newMenuStates = Object.keys(menuStates).forEach(
      key => (menuStates[key] = false)
    );
    updateMenuStates({ ...newMenuStates, isTopColorsMenuOpen: true });
  };

  const openColorSearch = () => {
    const newMenuStates = Object.keys(menuStates).forEach(
      key => (menuStates[key] = false)
    );
    updateMenuStates({ ...newMenuStates, isSearchMenuOpen: true });
    setTimeout(() => document.getElementById("color-search").focus(), 100);
  };

  const openHelpMenu = () => {
    const newMenuStates = Object.keys(menuStates).forEach(
      key => (menuStates[key] = false)
    );
    updateMenuStates({ ...newMenuStates, isHelpMenuOpen: true });
  };

  const closeSubMenu = () => {
    document.activeElement.blur();
    updateMenuStates({ menuStates, isMainMenuOpen: true });
  };

  return (
    <div id="sidebar" className={props.isOpen ? "" : "hidden"}>
      <div className="sidebar-content">
        <div
          className={
            "main-menu-items" + (menuStates.isMainMenuOpen ? "" : " hidden")
          }
        >
          <div className="secondary-main-menu">
            <div
              className="main-menu-item split-view"
              onClick={props.toggleSplitView}
            >
              <i className="icon fas fa-columns" />
              <span>Split View</span>
            </div>
          </div>
          {online && (
            <div className="online-menu-items">
              <div className="main-menu-item" onClick={openColorHistory}>
                <i className="icon fas fa-history" />
                <span>Color History</span>
              </div>
              <div className="main-menu-item" onClick={openTopColorsMenu}>
                <i className="icon fas fa-award" />
                <span>Most Popular</span>
              </div>
            </div>
          )}
          <div className="main-menu-item" onClick={openColorSearch}>
            <i className="icon fas fa-search" />
            <span>Search Colors</span>
          </div>
          <div className="main-menu-item" onClick={openHelpMenu}>
            <i className="icon fas fa-question-circle" />
            <span>What is this?</span>
          </div>
          <div className="footer-row">
            <a
              href="https://github.com/csandman/shade-generator"
              rel="noopener noreferrer"
              target="_blank"
              aria-label="Link to github repository">
            >
              <i className="icon fab fa-github" />
            </a>
            <a
              href="https://ko-fi.com/D1D513LDD"
              rel="noopener noreferrer"
              target="_blank"
              aria-label="Support me on Ko-fi"
            >
              <KofiButton className="icon " height="42"></KofiButton>
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
            <ColorHistory
              handleColorClick={props.handleColorClick}
              closeSidebar={props.closeSidebar}
            />
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
          <div className="search-input-container">
            <div className="search-icon-container">
              <i className="icon fas fa-search" />
            </div>
            <label htmlFor={"color-search"}>Color search</label>
            <input
              id="color-search"
              type="search"
              placeholder="Search..."
              value={searchInput}
              onChange={searchColorNames}
            />
          </div>

          <div className="sub-menu-content">
            <div className="menu-items">
              {colorNameList.map((color, i) => {
                return (
                  <div
                    key={color + i}
                    className="color-result-item"
                    style={{ background: color.hex, color: color.contrast }}
                    onClick={() => {
                      props.handleColorClick(color.hex, 1);
                      props.closeSidebar();
                    }}
                  >
                    {color.name}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className={"sub-menu" + (menuStates.isHelpMenuOpen ? "" : " hidden")}>
          <div onClick={closeSubMenu} className="sub-menu-header">
            <i className="icon fas fa-arrow-left" />
            <span>What is this?</span>
          </div>

          <div className="sub-menu-content">
            <HelpMenu />
          </div>
        </div>
      </div>
      <div className="background" onClick={props.closeSidebar} />
    </div>
  );
};

export default Sidebar;
