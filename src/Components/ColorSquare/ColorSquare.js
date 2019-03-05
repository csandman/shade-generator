import React, { Component } from "react";
import * as clipboard from "clipboard-polyfill";
import { Tooltip } from "react-tippy";
import "react-tippy/dist/tippy.css";
import "./ColorSquare.scss";

class ColorSquare extends Component {
  constructor(props) {
    super(props);
    this.copyHexCode = this.copyHexCode.bind(this);
    this.copyRgb = this.copyRgb.bind(this);
  }

  copyHexCode(e) {
    const output = this.props.color.hex;
    clipboard.writeText(output);
    this.changeButtonText(e.target, "Copied!");
  }

  copyRgb(e) {
    const rgb = this.props.color.rgb;
    const output = "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
    clipboard.writeText(output);
    this.changeButtonText(e.target, "Copied!");
  }

  changeButtonText(button, text) {
    const original = button.textContent;
    button.textContent = text;
    setTimeout(() => {
      button.textContent = original;
    }, 1200);
  }

  render() {
    return (
      <div className="color-square">
        <Tooltip
          trigger="mouseenter"
          position="bottom"
          arrow={true}
          animation="fade"
          interactive
          theme="dark-border"
          duration={200}
          html={
            <div>
              <div className="tooltip-title">CLICK TO COPY</div>
              <div className="popup-button">
                <button onClick={this.copyHexCode}>
                  {this.props.color.hex.toUpperCase()}
                </button>
              </div>
              <div className="popup-button">
                <button onClick={this.copyRgb}>
                  {"rgb: (" +
                    this.props.color.rgb[0] +
                    ", " +
                    this.props.color.rgb[1] +
                    ", " +
                    this.props.color.rgb[2] +
                    ")"}
                </button>
              </div>
            </div>
          }
        >
          <div
            style={{ backgroundColor: this.props.color.hex }}
            className="color-tile"
            onClick={() => {
              this.props.handleColorClick(
                this.props.color.hex,
                this.props.colorDataNumber
              );
            }}
          />
        </Tooltip>
      </div>
    );
  }
}

export default ColorSquare;
