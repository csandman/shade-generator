import React from "react";
import * as clipboard from "clipboard-polyfill";
import { Tooltip } from "react-tippy";
import "react-tippy/dist/tippy.css";
import "./ColorSquare.scss";

const ColorSquare = props => {

  const { rgb, hex } = props.color;
  const rgbStr = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;

  const copyHexCode = e => {
    const output = hex.toUpperCase();
    clipboard.writeText(output);
    changeButtonText(e.target, "Copied!");
  };

  const copyRgb = e => {
    const output = rgbStr;
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
              <button onClick={copyHexCode}>
                {hex.toUpperCase()}
              </button>
            </div>
            <div className="popup-button">
              <button onClick={copyRgb}>
                {rgbStr}
              </button>
            </div>
          </div>
        }
      >
        <div
          style={{ backgroundColor: hex }}
          className="color-tile"
          id={"tippy-tooltip-" + props.squareNumber}
          onClick={() => {
            props.handleColorClick(hex, props.bodyNum);
          }}
        />
      </Tooltip>
    </div>
  );
};

export default React.memo(ColorSquare);
