import React from "react";
import * as clipboard from "clipboard-polyfill";
import { Tooltip } from "react-tippy";
import "react-tippy/dist/tippy.css";
import "./ColorSquare.scss";

const ColorSquare = ({
  color: { rgb, hex },
  squareNumber,
  handleColorClick,
  bodyNum
}) => {
  const rgbStr = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;

  const changeButtonText = (e, text) => {
    const button = e.target;
    const originalText = button.textContent;
    button.textContent = text;
    setTimeout(() => {
      button.textContent = originalText;
    }, 1200);
  };

  const copyHexCode = e => {
    const output = hex.toUpperCase();
    clipboard.writeText(output);
    changeButtonText(e, "Copied!");
  };

  const copyRgb = e => {
    const output = rgbStr;
    clipboard.writeText(output);
    changeButtonText(e, "Copied!");
  };

  return (
    <div className="color-square">
      <Tooltip
        trigger="mouseenter"
        position="bottom"
        arrow
        animation="fade"
        interactive
        theme="dark-border"
        duration={200}
        html={
          <div>
            {/* <div className="tooltip-title">CONTRAST RATIO:</div>
            <div className="tooltip-title">
              {contrastRatio.toFixed(1)}:1{" "}
              {contrastLevel ? `(${contrastLevel})` : ""}
            </div> */}
            <div className="tooltip-title">CLICK TO COPY</div>
            <div className="popup-button">
              <button type="button" className="button" onClick={copyHexCode}>
                {hex.toUpperCase()}
              </button>
            </div>
            <div className="popup-button">
              <button type="button" className="button" onClick={copyRgb}>
                {rgbStr}
              </button>
            </div>
          </div>
        }
      >
        <button
          type="button"
          aria-label={`Color tile ${bodyNum}-${squareNumber}`}
          style={{ backgroundColor: hex }}
          className="color-tile"
          id={`tippy-tooltip-${bodyNum}-${squareNumber}`}
          onClick={() => {
            handleColorClick(hex, bodyNum);
          }}
        />
      </Tooltip>
    </div>
  );
};

export default React.memo(ColorSquare);
