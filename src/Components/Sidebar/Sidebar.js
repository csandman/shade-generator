import React, { useState, useEffect } from "react";
import _ from "lodash";
import namedColors from "color-name-list";
import "./Sidebar.scss";

import { getContrastColor, hexToRgb } from "../../Functions";

const Sidebar = props => {
  const getInitialColorNameList = () => {
    return namedColors.slice(0, 500).map(el => {
      el.contrast = getContrastColor(hexToRgb(el.hex));
      return el;
    });
  };

  const [searchInput, updateSearchInput] = useState("");
  const [colorNameList, updateColorNameList] = useState([]);
  const [menuStates, updateMenuStates] = useState({
    isMainMenuOpen: true,
    isHistoryMenuOpen: false,
    isSearchMenuOpen: false,
    isTopColorsMenuOpen: false
  });

  useEffect(() => updateColorNameList(getInitialColorNameList()), []);

  const searchColorNames = e => {
    updateSearchInput(e.target.value);
    let newColorArr = [];
    let index = 0;
    while (newColorArr.length < 500 && index < namedColors.length) {
      if (
        namedColors[index]
          .name
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
    let newState = _.mapValues(menuStates, () => false);
    newState.isHistoryMenuOpen = true;
    updateMenuStates(newState);
  };

  const openTopColorsMenu = () => {
    let newState = _.mapValues(menuStates, () => false);
    newState.isTopColorsMenuOpen = true;
    updateMenuStates(newState);
  };

  const openColorSearch = () => {
    let newState = _.mapValues(menuStates, () => false);
    newState.isSearchMenuOpen = true;
    updateMenuStates(newState);
    setTimeout(() => document.getElementById("color-search").focus(), 100);
  };

  const closeSubMenu = () => {
    document.activeElement.blur();
    let newState = _.mapValues(menuStates, () => false);
    newState.isMainMenuOpen = true;
    updateMenuStates(newState);
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
            <div className="main-menu-item" onClick={props.getRandomColors}>
              <i className="icon fas fa-random" />
              <span>Random Colors</span>
            </div>
            <div
              className="main-menu-item split-view"
              onClick={props.toggleSplitView}
            >
              <i className="icon fas fa-columns" />
              <span>Split View</span>
            </div>
          </div>
          {props.online && (
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
            <div className="menu-items">
              {props.menuItems.map((item, i) => {
                return (
                  <div
                    key={item.hex + i}
                    className="menu-item"
                    style={{ backgroundColor: item.hex }}
                    onClick={() => {
                      props.handleColorClick(item.hex, 1);
                      props.closeSidebar();
                    }}
                    data-hex={item.hex}
                  >
                    <div
                      className="color-name"
                      style={{ color: item.contrast }}
                      data-hex={item.hex}
                    >
                      {item.name}
                    </div>
                    <div
                      className="color-name"
                      style={{ color: item.contrast }}
                      data-hex={item.hex}
                    >
                      {item.hex}
                    </div>
                    <div
                      className="footer-left"
                      style={{ color: item.contrast }}
                    >
                      {item.dateString}
                    </div>
                    <div
                      className="footer-right"
                      style={{ color: item.contrast }}
                    >
                      {item.timeString}
                    </div>
                  </div>
                );
              })}
            </div>
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
            <div className="menu-items">
              {props.topColors.map((item, i) => {
                return (
                  <div
                    key={item.hex + i}
                    className="menu-item"
                    style={{ backgroundColor: item.hex }}
                    onClick={() => {
                      props.handleColorClick(item.hex, 1);
                      props.closeSidebar();
                    }}
                    data-hex={item.hex}
                  >
                    <div
                      className="color-name"
                      style={{ color: item.contrast }}
                      data-hex={item.hex}
                    >
                      {item.name}
                    </div>
                    <div
                      className="color-name"
                      style={{ color: item.contrast }}
                      data-hex={item.hex}
                    >
                      {item.hex}
                    </div>
                    <div
                      className="footer-left"
                      style={{ color: item.contrast }}
                      data-hex={item.hex}
                    >
                      {item.count} X
                    </div>
                  </div>
                );
              })}
            </div>
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
      </div>
      <div className="background" onClick={props.closeSidebar} />
    </div>
  );
};

export default Sidebar;
