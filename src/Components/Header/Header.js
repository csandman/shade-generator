import React from "react";
import HamburgerButton from "../HamburgerButton";
import "./Header.scss";

const Header = props => {
  return (
    <div
      id="header"
      style={
        !props.splitView || props.splitScreenDisabled
          ? {
              borderColor: props.colorData.contrast,
              backgroundColor: props.colorData.hex
            }
          : {}
      }
    >
      <div className="left-content">
        {props.colorData.shades.length && (
          <div className="icon" onClick={props.getRandomColors}>
            <div
              style={{
                backgroundColor:
                  props.splitView && !props.splitScreenDisabled
                    ? "#7a7a7a"
                    : props.colorData.shades[10].hex
              }}
              className="icon-dot"
            />
            <div
              style={{
                backgroundColor:
                  props.splitView && !props.splitScreenDisabled
                    ? "#000"
                    : props.colorData.shades[24].hex
              }}
              className="icon-dot"
            />
            <div
              style={{
                backgroundColor:
                  props.splitView && !props.splitScreenDisabled
                    ? "#000"
                    : props.colorData.shades[24].hex
              }}
              className="icon-dot"
            />
            <div
              style={{
                backgroundColor:
                  props.splitView && !props.splitScreenDisabled
                    ? "#7a7a7a"
                    : props.colorData.shades[10].hex
              }}
              className="icon-dot"
            />
          </div>
        )}
        <h1
          style={
            !props.splitView || props.splitScreenDisabled
              ? {
                  color: props.colorData.contrast
                }
              : {}
          }
        >
          Shade Generator
        </h1>
      </div>
      <div className="right-content">
        <div className="button-section">
          <div
            className="icon-button random-button"
            onClick={props.getRandomColors}
            style={
              !props.splitView || props.splitScreenDisabled
                ? {
                    borderColor: props.colorData.contrast,
                    color: props.colorData.contrast
                  }
                : {}
            }
          >
            <i
              className="fas fa-random"
              style={
                !props.splitView || props.splitScreenDisabled
                  ? {
                      color: props.colorData.contrast
                    }
                  : {}
              }
            />
            <span
              className="random-button-text"
              style={
                !props.splitView || props.splitScreenDisabled
                  ? {
                      borderColor: props.colorData.contrast,
                      color: props.colorData.contrast
                    }
                  : {}
              }
            >
              Random
            </span>
          </div>

          <div
            className={
              "icon-button split-button" + (props.splitView ? " active" : "")
            }
            onClick={props.toggleSplitView}
            style={
              !props.splitView || props.splitScreenDisabled
                ? {
                    borderColor: props.colorData.contrast,
                    color: props.colorData.contrast
                  }
                : {}
            }
          >
            <i
              className="fas fa-columns"
              style={
                !props.splitView || props.splitScreenDisabled
                  ? {
                      color: props.colorData.contrast
                    }
                  : {}
              }
            />
            <span
              style={
                !props.splitView || props.splitScreenDisabled
                  ? {
                      borderColor: props.colorData.contrast,
                      color: props.colorData.contrast
                    }
                  : {}
              }
            >
              Split View
            </span>
          </div>
        </div>
        <HamburgerButton
          className="menu-icon"
          open={props.menuIsOpen}
          action={props.toggleSidebar}
          color={
            !props.splitView || props.splitScreenDisabled
              ? props.colorData.contrast
              : "#7a7a7a"
          }
        />
      </div>
    </div>
  );
};

export default React.memo(Header);

// <div
// className="icon-button"
// onClick={props.handleSignupClick}
// style={{
//   borderColor: props.splitView
//     ? props.baseColor.contrast
//     : props.colorData.contrast,
//   color: props.splitView
//     ? props.baseColor.contrast
//     : props.colorData.contrast,
//   backgroundColor: props.splitView
//     ? props.baseColor.oppositeContrast
//     : props.colorData.oppositeContrast
// }}
// >
// <i
//   className="fas fa-user"
//   style={{
//     color: props.splitView
//       ? props.baseColor.contrast
//       : props.colorData.contrast
//   }}
// />
// Sign in
// </div>
