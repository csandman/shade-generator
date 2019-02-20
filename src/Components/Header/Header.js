import React from "react";
import { getRandomHexColor } from "../../Functions";
import "./Header.scss";

const Header = props => {
  const generateRandomColor = () => {
    props.updateStateValues(getRandomHexColor());
  };

  return (
    <div
      id="header"
      style={{
        borderBottom:
          "2px solid " +
          (props.splitView ? "rgb(122, 122, 122)" : props.colorData.contrast),
        backgroundColor: props.splitView ? "#222" : props.colorData.hex
      }}
    >
      <div
        style={{
          color: props.splitView
            ? "rgb(122, 122, 122)"
            : props.colorData.contrast
        }}
        className="title-text"
      >
        {props.colorData.shades.length && (
          <div className="icon" onClick={generateRandomColor}>
            <div
              style={{ backgroundColor: props.splitView ? props.colorData.hex : props.colorData.shades[10].hex }}
              className="icon-dot"
            />
            <div
              style={{ backgroundColor: props.splitView ? props.colorDataAlt.hex : props.colorData.shades[24].hex }}
              className="icon-dot"
            />
            <div
              style={{ backgroundColor: props.splitView ? props.colorDataAlt.hex : props.colorData.shades[24].hex }}
              className="icon-dot"
            />
            <div
              style={{ backgroundColor: props.splitView ? props.colorData.hex : props.colorData.shades[10].hex }}
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
            onClick={props.getRandomColors}
            style={{
              borderColor: props.splitView
                ? "rgb(122, 122, 122)"
                : props.colorData.contrast,
              color: props.splitView
                ? "rgb(122, 122, 122)"
                : props.colorData.contrast,
              backgroundColor: props.splitView
                ? "rgb(24, 24, 24)"
                : props.colorData.oppositeContrast
            }}
          >
            <i
              className="fas fa-random"
              style={{
                color: props.splitView
                  ? "rgb(122, 122, 122)"
                  : props.colorData.contrast
              }}
            />
            Random
          </div>

          <div
            className="icon-button"
            onClick={props.toggleSplitView}
            style={{
              borderColor: props.splitView
                ? "rgb(122, 122, 122)"
                : props.colorData.contrast,
              color: props.splitView
                ? "rgb(24, 24, 24)"
                : props.colorData.contrast,
              backgroundColor: props.splitView
                ? "rgb(122, 122, 122)"
                : props.colorData.oppositeContrast
            }}
          >
            <i
              className="fas fa-columns"
              style={{
                color: props.splitView
                  ? "rgb(24, 24, 24)"
                  : props.colorData.contrast
              }}
            />
            Split View
          </div>
          <div
            className="icon-button"
            onClick={props.handleSignupClick}
            style={{
              borderColor: props.splitView
                ? "rgb(122, 122, 122)"
                : props.colorData.contrast,
              color: props.splitView
                ? "rgb(122, 122, 122)"
                : props.colorData.contrast,
              backgroundColor: props.splitView
                ? "rgb(24, 24, 24)"
                : props.colorData.oppositeContrast
            }}
          >
            <i
              className="fas fa-user"
              style={{
                color: props.splitView
                  ? "rgb(122, 122, 122)"
                  : props.colorData.contrast
              }}
            />
            Sign in
          </div>
        </div>
        <i
          className="fas fa-bars menu-icon"
          style={{
            color: props.splitView
              ? "rgb(122, 122, 122)"
              : props.colorData.contrast
          }}
          onClick={props.openSidebar}
        />
      </div>
    </div>
  );
};

export default Header;
