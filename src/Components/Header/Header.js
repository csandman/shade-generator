import React, { Component } from "react";
import HamburgerButton from "../HamburgerButton";
import "./Header.scss";

class Header extends Component {
  render() {
    return (
      <div
        id="header"
        style={
          (!this.props.splitView || this.props.splitSreenDisabled) && {
            borderColor: this.props.colorData.contrast,
            backgroundColor: this.props.colorData.hex
          }
        }
      >
        <div
          style={
            (!this.props.splitView || this.props.splitSreenDisabled) && {
              color: this.props.colorData.contrast
            }
          }
          className="title-text"
        >
          {this.props.colorData.shades.length && (
            <div className="icon" onClick={this.props.getRandomColors}>
              <div
                style={{
                  backgroundColor:
                    this.props.splitView && !this.props.splitSreenDisabled
                      ? this.props.colorData.hex
                      : this.props.colorData.shades[10].hex
                }}
                className="icon-dot"
              />
              <div
                style={{
                  backgroundColor:
                    this.props.splitView && !this.props.splitSreenDisabled
                      ? this.props.colorDataAlt.hex
                      : this.props.colorData.shades[24].hex
                }}
                className="icon-dot"
              />
              <div
                style={{
                  backgroundColor:
                    this.props.splitView && !this.props.splitSreenDisabled
                      ? this.props.colorDataAlt.hex
                      : this.props.colorData.shades[24].hex
                }}
                className="icon-dot"
              />
              <div
                style={{
                  backgroundColor:
                    this.props.splitView && !this.props.splitSreenDisabled
                      ? this.props.colorData.hex
                      : this.props.colorData.shades[10].hex
                }}
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
              onClick={this.props.getRandomColors}
              style={
                (!this.props.splitView || this.props.splitSreenDisabled) && {
                  borderColor: this.props.colorData.contrast,
                  color: this.props.colorData.contrast,
                  backgroundColor: this.props.colorData.oppositeContrast
                }
              }
            >
              <i
                className="fas fa-random"
                style={
                  (!this.props.splitView || this.props.splitSreenDisabled) && {
                    color: this.props.colorData.contrast
                  }
                }
              />
              Random
            </div>

            <div
              className={"icon-button" + (this.props.splitView ? " active" : "")}
              onClick={this.props.toggleSplitView}
              style={
                (!this.props.splitView || this.props.splitSreenDisabled) && {
                  borderColor: this.props.colorData.contrast,
                  color: this.props.colorData.contrast,
                  backgroundColor: this.props.colorData.oppositeContrast
                }
              }
            >
              <i
                className="fas fa-columns"
                style={
                  (!this.props.splitView || this.props.splitSreenDisabled) && {
                    color: this.props.colorData.contrast
                  }
                }
              />
              Split View
            </div>
          </div>
          <HamburgerButton
            className="menu-icon"
            open={this.props.menuIsOpen}
            action={this.props.toggleSidebar}
            color={
              !this.props.splitView || this.props.splitSreenDisabled
                ? this.props.colorData.contrast
                : "#7a7a7a"
            }
          />
        </div>
      </div>
    );
  }
}

export default Header;

// <div
// className="icon-button"
// onClick={this.props.handleSignupClick}
// style={{
//   borderColor: this.props.splitView
//     ? this.props.baseColor.contrast
//     : this.props.colorData.contrast,
//   color: this.props.splitView
//     ? this.props.baseColor.contrast
//     : this.props.colorData.contrast,
//   backgroundColor: this.props.splitView
//     ? this.props.baseColor.oppositeContrast
//     : this.props.colorData.oppositeContrast
// }}
// >
// <i
//   className="fas fa-user"
//   style={{
//     color: this.props.splitView
//       ? this.props.baseColor.contrast
//       : this.props.colorData.contrast
//   }}
// />
// Sign in
// </div>
