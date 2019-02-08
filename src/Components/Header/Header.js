import React, { Component } from "react";
import { hexToRgb, getRandomHexColor } from "../../Functions";
import "./Header.scss";

export default class Header extends Component {
  constructor(props) {
    super(props);

    this.handleSignInClick = this.handleSignInClick.bind(this);
    this.generateRandomColor = this.generateRandomColor.bind(this);
  }

  handleSignInClick(e) {}

  handleSignUpClick(e) {}

  generateRandomColor() {
    this.props.updateStateValues(hexToRgb(getRandomHexColor()));
  }

  render() {
    return (
      <div
        id="header"
        style={{
          borderBottom: "2px solid " + this.props.contrastColor,
          backgroundColor: this.props.hexColor
        }}
      >
        <div style={{ color: this.props.contrastColor }} className="title-text">
          {this.props.colorArr.length && (
            <div className="icon" onClick={this.generateRandomColor}>
              <div
                style={{ backgroundColor: this.props.colorArr[10].hex }}
                className="icon-dot"
              />
              <div
                style={{ backgroundColor: this.props.colorArr[24].hex }}
                className="icon-dot"
              />
              <div
                style={{ backgroundColor: this.props.colorArr[24].hex }}
                className="icon-dot"
              />
              <div
                style={{ backgroundColor: this.props.colorArr[10].hex }}
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
            onClick={this.generateRandomColor}
            style={{
              borderColor: this.props.contrastColor,
              color: this.props.contrastColor,
              backgroundColor: this.props.oppositeContrastColor
            }}
          >
            <i
              className="fas fa-random"
              style={{
                color: this.props.contrastColor
              }}
            />
            Random
          </div>
          
          </div>
          <i
            className="fas fa-bars menu-icon"
            style={{ color: this.props.contrastColor }}
            onClick={this.props.openSidebar}
          />
        </div>
        
      </div>
    );
  }
}