import React, { useState } from "react";
import * as clipboard from "clipboard-polyfill";
import { Tooltip } from "react-tippy";
import "react-tippy/dist/tippy.css";
import "./ColorSquare.scss";

let hexTimeout;
let rgbTimeout;

const ColorSquare = ({
  color: { rgb, hex },
  squareNumber,
  handleColorClick,
  bodyNum
}) => {
  const [r, g, b] = rgb;
  const rgbStr = `rgb(${r}, ${g}, ${b})`;
  const hexStr = hex.toUpperCase();

  const [rgbBtnTxt, setRgbBtnTxt] = useState(rgbStr);
  const [hexBtnTxt, setHexBtnTxt] = useState(hexStr);

  const copyHexCode = () => {
    clipboard.writeText(hexStr);
    setHexBtnTxt("Copied!");
    clearTimeout(hexTimeout);
    hexTimeout = setTimeout(() => {
      setHexBtnTxt(hexStr);
    }, 1200);
  };

  const copyRgb = () => {
    clipboard.writeText(rgbStr);
    setRgbBtnTxt("Copied!");
    clearTimeout(rgbTimeout);
    rgbTimeout = setTimeout(() => {
      setRgbBtnTxt(rgbStr);
    }, 1200);
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
                {hexBtnTxt}
              </button>
            </div>
            <div className="popup-button">
              <button type="button" className="button" onClick={copyRgb}>
                {rgbBtnTxt}
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
