import React from "react";
import "./Header.scss";

const Header = props => {

  return (
    <div
      id="header"
      style={{
        borderBottom:
          "2px solid " +
          (props.splitView ? props.baseColor.contrast : props.colorData.contrast),
        backgroundColor: props.splitView ? props.baseColor.color : props.colorData.hex
      }}
    >
      <div
        style={{
          color: props.splitView
            ? props.baseColor.contrast
            : props.colorData.contrast
        }}
        className="title-text"
      >
        {props.colorData.shades.length && (
          <div className="icon" onClick={props.getRandomColors}>
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
                ? props.baseColor.contrast
                : props.colorData.contrast,
              color: props.splitView
                ? props.baseColor.contrast
                : props.colorData.contrast,
              backgroundColor: props.splitView
                ? props.baseColor.oppositeContrast
                : props.colorData.oppositeContrast
            }}
          >
            <i
              className="fas fa-random"
              style={{
                color: props.splitView
                  ? props.baseColor.contrast
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
                ? props.baseColor.contrast
                : props.colorData.contrast,
              color: props.splitView
                ? props.baseColor.oppositeContrast
                : props.colorData.contrast,
              backgroundColor: props.splitView
                ? props.baseColor.contrast
                : props.colorData.oppositeContrast
            }}
          >
            <i
              className="fas fa-columns"
              style={{
                color: props.splitView
                  ? props.baseColor.oppositeContrast
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
                ? props.baseColor.contrast
                : props.colorData.contrast,
              color: props.splitView
                ? props.baseColor.contrast
                : props.colorData.contrast,
              backgroundColor: props.splitView
                ? props.baseColor.oppositeContrast
                : props.colorData.oppositeContrast
            }}
          >
            <i
              className="fas fa-user"
              style={{
                color: props.splitView
                  ? props.baseColor.contrast
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
              ? props.baseColor.contrast
              : props.colorData.contrast
          }}
          onClick={props.openSidebar}
        />
      </div>
    </div>
  );
};

export default Header;
