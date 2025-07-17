import { useSplitView } from 'contexts/split-view-context';
import type { ColorInfo } from 'utils/color';

interface HeaderIconProps {
  getRandomColors: () => void;
  colorData: ColorInfo;
}

const HeaderIcon = ({ getRandomColors, colorData }: HeaderIconProps) => {
  const { splitView, splitViewDisabled } = useSplitView();

  return (
    <div className="icon" onClick={getRandomColors}>
      <div
        style={{
          backgroundColor:
            splitView && !splitViewDisabled
              ? '#7a7a7a'
              : colorData.shades[10].hex,
        }}
        className="icon-dot"
      />
      <div
        style={{
          backgroundColor:
            splitView && !splitViewDisabled ? '#000' : colorData.shades[24].hex,
        }}
        className="icon-dot"
      />
      <div
        style={{
          backgroundColor:
            splitView && !splitViewDisabled ? '#000' : colorData.shades[24].hex,
        }}
        className="icon-dot"
      />
      <div
        style={{
          backgroundColor:
            splitView && !splitViewDisabled
              ? '#7a7a7a'
              : colorData.shades[10].hex,
        }}
        className="icon-dot"
      />
    </div>
  );
};

export default HeaderIcon;
