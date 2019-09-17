import React, { useState, useEffect, useContext } from "react";
import namedColors from "color-name-list";
import SidebarContext from '../../../Contexts/SidebarContext';

import { getContrastColor, hexToRgb } from "../../../Functions";

const ColorNameMenu = props => {

  const { closeMenu } = useContext(SidebarContext);

  useEffect(() => {
    updateColorNameList(getInitialColorNameList());
  },[])

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

  return (
    <>
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
