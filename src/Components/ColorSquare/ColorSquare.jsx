import { memo, useState, useRef } from 'react';
import * as clipboard from 'clipboard-polyfill';
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css';
import './ColorSquare.scss';

const ColorSquare = ({ color: { rgb, hex }, squareNumber, bodyNum }) => {
  const hexTimeout = useRef();
  const rgbTimeout = useRef();
  const [r, g, b] = rgb;
  const rgbStr = `rgb(${r}, ${g}, ${b})`;
  const hexStr = hex.toUpperCase();

  const [rgbBtnTxt, setRgbBtnTxt] = useState(rgbStr);
  const [hexBtnTxt, setHexBtnTxt] = useState(hexStr);

  const background =
    squareNumber <= 18
      ? `rgba(255,255,255,${(95 - squareNumber * 5) / 100})`
      : `rgba(0,0,0,${((squareNumber - 18) * 5) / 100})`;

  const copyHexCode = () => {
    clipboard.writeText(hexStr);
    setHexBtnTxt('Copied!');
    clearTimeout(hexTimeout.current);
    hexTimeout.current = setTimeout(() => {
      setHexBtnTxt(hexStr);
    }, 1200);
  };

  const copyRgb = () => {
    clipboard.writeText(rgbStr);
    setRgbBtnTxt('Copied!');
    clearTimeout(rgbTimeout.current);
    rgbTimeout.current = setTimeout(() => {
      setRgbBtnTxt(rgbStr);
    }, 1200);
  };

  return (
    <div className="color-square">
      <Tooltip
        hideOnClick={false}
        trigger="mouseenter"
        position="bottom"
        arrow
        animation="fade"
        interactive
        theme="dark-border"
        duration={200}
        html={
          <div>
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
            {/* <div className="tooltip-sub-title">
              CONTRAST - {contrastRatio.toFixed(1)}:1{" "}
              {contrastLevel ? `(${contrastLevel})` : ""}
            </div> */}
          </div>
        }
      >
        <div
          // type="button"
          aria-label={`Color tile ${bodyNum}-${squareNumber}`}
          style={{ background }}
          className="color-tile"
          id={`tippy-tooltip-${(bodyNum - 1) * 36 + squareNumber}`}
          // onClick={e => {
          //   handleColorClick(hex, bodyNum);
          // }}
        />
      </Tooltip>
    </div>
  );
};

export default memo(ColorSquare);
