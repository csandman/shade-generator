import Color from 'color';
import { useSplitView } from 'contexts/split-view-context';

import './ContrastRatio.scss';

const ContrastRatio = ({ hex1, hex2 }) => {
  const { splitView, splitViewDisabled } = useSplitView();

  const color1 = Color(hex1);
  const color2 = Color(hex2);

  const ratio = color1.contrast(color2).toFixed(2);
  const level = color1.level(color2);

  return splitView && !splitViewDisabled ? (
    <div className="contrast-ratio">
      <h3 className="ratio-text">
        CONTRAST <br /> RATIO
      </h3>
      <h3 className="ratio">
        {ratio} {level ? `(${level})` : ''}
      </h3>
    </div>
  ) : null;
};

export default ContrastRatio;
