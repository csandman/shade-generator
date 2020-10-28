import React, { useContext } from 'react';
import ColorSquare from '../ColorSquare';
import ColorInput from '../ColorInput';
import SplitViewContext from '../../Contexts/SplitViewContext';
import './BodyContent.scss';

const BodyContent = ({
  handleSubmit,
  bodyNum,
  colorData,
  handleColorClick,
}) => {
  const { splitView, splitViewDisabled } = useContext(SplitViewContext);

  return (
    <div
      className="content-background"
      style={{ backgroundColor: colorData.hex }}
    >
      <div
        className={`body-content ${
          splitView && !splitViewDisabled ? 'split' : ''
        }`}
      >
        <div className="input-container">
          <ColorInput
            handleSubmit={handleSubmit}
            bodyNum={bodyNum}
            contrast={colorData.contrast}
            oppositeContrast={colorData.oppositeContrast}
          />
          <div className="color-name" style={{ color: colorData.contrast }}>
            {colorData.name}
          </div>
        </div>
        <div className="container">
          {colorData.shades.map((color, index) => {
            return (
              <ColorSquare
                hex={color.hex}
                handleColorClick={handleColorClick}
                bodyNum={bodyNum}
                color={color}
                key={`color-square-${bodyNum}-${index}-${color.hex}`}
                squareNumber={index + 1}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BodyContent;
