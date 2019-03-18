import React from "react";
import * as clipboard from "clipboard-polyfill";
import { Tooltip } from "react-tippy";
import "react-tippy/dist/tippy.css";
import "./ColorSquare.scss";

const ColorSquare = props => {
  const copyHexCode = e => {
    const output = props.color.hex;
    clipboard.writeText(output);
    changeButtonText(e.target, "Copied!");
  };

  const copyRgb = e => {
    const rgb = props.color.rgb;
    const output = "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
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
                {props.color.hex.toUpperCase()}
              </button>
            </div>
            <div className="popup-button">
              <button onClick={copyRgb}>
                {"rgb: (" +
                  props.color.rgb[0] +
                  ", " +
                  props.color.rgb[1] +
                  ", " +
                  props.color.rgb[2] +
                  ")"}
              </button>
            </div>
          </div>
        }
      >
        <div
          style={{ backgroundColor: props.color.hex }}
          className="color-tile"
          id={"tippy-tooltip-" + props.squareNumber}
          onClick={() => {
            props.handleColorClick(props.color.hex, props.colorDataNumber);
          }}
        />
      </Tooltip>
    </div>
  );
};

export default ColorSquare;
