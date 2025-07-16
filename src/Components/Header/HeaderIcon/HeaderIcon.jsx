import { useSplitView } from 'contexts/split-view-context';

const HeaderIcon = ({ getRandomColors, colorData }) => {
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
