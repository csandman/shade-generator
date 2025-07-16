import ColorSquare from 'Components/ColorSquare';
import ColorInput from 'Components/ColorInput';
import { useSplitView } from 'contexts/split-view-context';
import './BodyContent.scss';

const BodyContent = ({
  handleSubmit,
  bodyNum,
  colorData,
  handleColorClick,
}) => {
  const { splitView, splitViewDisabled } = useSplitView();

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
