import React from "react";
import { hexToRgb, getRandomHexColor } from "../../Functions";
import "./Header.scss";

const Header = props => {
  const generateRandomColor = () => {
    props.updateStateValues(hexToRgb(getRandomHexColor()));
  };

  return (
    <div
      id="header"
      style={{
        borderBottom: "2px solid " + props.contrastColor,
        backgroundColor: props.hexColor
      }}
    >
      <div style={{ color: props.contrastColor }} className="title-text">
        {props.colorArr.length && (
          <div className="icon" onClick={generateRandomColor}>
            <div
              style={{ backgroundColor: props.colorArr[10].hex }}
              className="icon-dot"
            />
            <div
              style={{ backgroundColor: props.colorArr[24].hex }}
              className="icon-dot"
            />
            <div
              style={{ backgroundColor: props.colorArr[24].hex }}
              className="icon-dot"
            />
            <div
              style={{ backgroundColor: props.colorArr[10].hex }}
              className="icon-dot"
            />
          </div>
        )}
        Shade Generator
      </div>
      <div className="right-content">
        <div className="button-section">
          <div
            className="icon-button"
            onClick={generateRandomColor}
            style={{
              borderColor: props.contrastColor,
              color: props.contrastColor,
              backgroundColor: props.oppositeContrastColor
            }}
          >
            <i
              className="fas fa-random"
              style={{
                color: props.contrastColor
              }}
            />
            Random
          </div>
          <div
            className="icon-button"
            onClick={props.handleSignupClick}
            style={{
              borderColor: props.contrastColor,
              color: props.contrastColor,
              backgroundColor: props.oppositeContrastColor
            }}
          >
            <i
              className="fas fa-user"
              style={{
                color: props.contrastColor
              }}
            />
            Sign in
          </div>
        </div>
        <i
          className="fas fa-bars menu-icon"
          style={{ color: props.contrastColor }}
          onClick={props.openSidebar}
        />
      </div>
    </div>
  );
};

export default Header;