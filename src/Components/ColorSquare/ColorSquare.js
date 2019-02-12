import React from "react";
import * as clipboard from "clipboard-polyfill";
import { Tooltip } from "react-tippy";
import "react-tippy/dist/tippy.css";
import "./ColorSquare.scss";

const ColorSquare = ({ color }) => {
  const copyHexCode = e => {
    const output = color.hex;
    clipboard.writeText(output);
    changeButtonText(e.target, "Copied!");
  };

  const copyRgb = e => {
    const rgb = color.rgb;
    const output = "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")";
    clipboard.writeText(output);
    changeButtonText(e.target, "Copied!");
  };

  const changeButtonText = (button, text) => {
    const original = button.textContent;
    button.textContent = text;
    setTimeout(() => {
      button.textContent = original;
    }, 1200);
  };

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
              <button onClick={copyHexCode}>{color.hex.toUpperCase()}</button>
            </div>
            <div className="popup-button">
              <button onClick={copyRgb}>
                {"rgb: (" +
                  color.rgb[0] +
                  ", " +
                  color.rgb[1] +
                  ", " +
                  color.rgb[2] +
                  ")"}
              </button>
            </div>
          </div>
        }
      >
        <div style={{ backgroundColor: color.hex }} className="color-tile" />
      </Tooltip>
    </div>
  );
};

export default ColorSquare;
