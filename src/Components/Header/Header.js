import React from "react";
import HeaderIcon from "./HeaderIcon/HeaderIcon";
import HeaderButton from "./HeaderButton/HeaderButton";
import HamburgerButton from "../HamburgerButton";
import "./Header.scss";

const Header = ({
  splitView,
  splitViewDisabled,
  colorData,
  getRandomColors,
  toggleSplitView
}) => {
  return (
    <div
      id="header"
      style={
        !splitView || splitViewDisabled
          ? {
              borderColor: colorData.contrast,
              backgroundColor: colorData.hex
            }
          : {}
      }
    >
      <div className="left-content">
        {colorData.shades.length && (
          <HeaderIcon
            getRandomColors={getRandomColors}
            splitViewDisabled={splitViewDisabled}
            splitView={splitView}
            colorData={colorData}
          />
        )}
        <h1
          style={
            !splitView || splitViewDisabled
              ? {
                  color: colorData.contrast
                }
              : {}
          }
        >
          Shade Generator
        </h1>
      </div>
      <div className="right-content">
        <div className="button-section">
          <HeaderButton 
            action={getRandomColors}
            className="random-button"
            splitViewDisabled={splitViewDisabled}
            splitView={splitView}
            colorData={colorData}
            buttonText="Random"
            iconClassName="fas fa-random"
            textClassName="random-button-text"
          />
          <HeaderButton 
            action={toggleSplitView}
            className={`split-button ${splitView ? " active" : ""}`}
            splitViewDisabled={splitViewDisabled}
            splitView={splitView}
            colorData={colorData}
            buttonText="Split View"
            iconClassName="fas fa-columns"
          />
        </div>
        <HamburgerButton
          className="menu-icon"
          color={
            !splitView || splitViewDisabled ? colorData.contrast : "#7a7a7a"
          }
        />
      </div>
    </div>
  );
};

export default React.memo(Header);
