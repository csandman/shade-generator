import { memo, useState, useRef } from 'react';
import { writeText as writeTextToClipboard } from 'clipboard-polyfill';
import Tooltip from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import './ColorSquare.scss';
import type { ColorShade } from 'utils/color';
import type { BodyNumber } from 'types/app';

interface ColorSquareProps {
  color: ColorShade;
  squareNumber: number;
  bodyNum: BodyNumber;
}

const ColorSquare = ({
  color: { rgb, hex },
  squareNumber,
  bodyNum,
}: ColorSquareProps) => {
  const hexTimeout = useRef<NodeJS.Timeout | null>(null);
  const rgbTimeout = useRef<NodeJS.Timeout | null>(null);
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
    writeTextToClipboard(hexStr);
    setHexBtnTxt('Copied!');
    if (hexTimeout.current) {
      clearTimeout(hexTimeout.current);
    }
    hexTimeout.current = setTimeout(() => {
      setHexBtnTxt(hexStr);
    }, 1200);
  };

  const copyRgb = () => {
    writeTextToClipboard(rgbStr);
    setRgbBtnTxt('Copied!');
    if (rgbTimeout.current) {
      clearTimeout(rgbTimeout.current);
    }
    rgbTimeout.current = setTimeout(() => {
      setRgbBtnTxt(rgbStr);
    }, 1200);
  };

  return (
    <div className="color-square">
      <Tooltip
        hideOnClick={false}
        trigger="mouseenter"
        placement="bottom"
        arrow
        animation="fade"
        interactive
        theme="dark-border"
        duration={200}
        content={
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
          </div>
        }
      >
        <div
          aria-label={`Color tile ${bodyNum}-${squareNumber}`}
          style={{ background }}
          className="color-tile"
          id={`tippy-tooltip-${(bodyNum - 1) * 36 + squareNumber}`}
        />
      </Tooltip>
    </div>
  );
};

export default memo(ColorSquare);
