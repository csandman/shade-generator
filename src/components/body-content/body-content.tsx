import ColorSquare from 'components/color-square';
import ColorInput from 'components/color-input';
import { useSplitView } from 'contexts/split-view-context';
import './body-content.scss';
import type { ColorInfo } from 'utils/color';
import type { BodyNumber } from 'types/app';

interface BodyContentProps {
  handleSubmit: (bodyNum: BodyNumber, inputValue: string) => void;
  bodyNum: BodyNumber;
  colorData: ColorInfo;
}

const BodyContent = ({
  handleSubmit,
  bodyNum,
  colorData,
}: BodyContentProps) => {
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
          {colorData.shades.map((color, index) => (
            <ColorSquare
              key={color.hex}
              bodyNum={bodyNum}
              color={color}
              squareNumber={index + 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BodyContent;
