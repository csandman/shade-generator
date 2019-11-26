import React, { useState, useContext, useRef, useEffect } from "react";
import Color from "color";
import namedColors from "color-name-list";
import SidebarContext from "../../../Contexts/SidebarContext";

import { getContrastColor } from "../../../Functions";

const initialColorNameList = namedColors.slice(0, 50).map(el => ({
  ...el,
  contrast: getContrastColor(Color(el.hex)).hex()
}));

let inputElTimeout;

const ColorNameMenu = ({ handleColorClick, isOpen }) => {
  const { closeMenu } = useContext(SidebarContext);

  const inputEl = useRef(null);

  useEffect(() => {
    clearTimeout(inputElTimeout);
    if (isOpen) {
      inputElTimeout = setTimeout(() => {
        inputEl.current.focus();
      }, 300);
    } else {
      inputEl.current.blur();
    }
  }, [isOpen]);

  const [searchInput, updateSearchInput] = useState("");
  const [colorNameList, updateColorNameList] = useState(initialColorNameList);

  const searchColorNames = e => {
    updateSearchInput(e.target.value);
    const newColorArr = [];
    let index = 0;
    while (newColorArr.length < 100 && index < namedColors.length) {
      if (
        namedColors[index].name
          .replace(/\s/g, "")
          .toLowerCase()
          .indexOf(e.target.value.replace(/\s/g, "").toLowerCase()) >= 0
      ) {
        newColorArr.push(namedColors[index]);
      }
      index += 1;
    }
    newColorArr.map(el => ({
      ...el,
      contrast: getContrastColor(Color(el.hex)).hex()
    }));
    updateColorNameList(newColorArr);
  };

  return (
    <>
      <div className="search-input-container">
        <div className="search-icon-container">
          <i className="icon fas fa-search" />
        </div>
        <label htmlFor="color-search">Color search</label>
        <input
          ref={inputEl}
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
                  handleColorClick(color.hex, 1);
                  closeMenu();
                }}
              >
                {color.name}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ColorNameMenu;
