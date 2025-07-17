/* eslint-disable react/no-array-index-key */
import { useHistory } from 'contexts/history-context';
import type { ColorCallback } from 'types/app';
import MenuItem from './MenuItem';

interface ColorHistoryProps {
  handleColorClick: ColorCallback;
}

const ColorHistory = ({ handleColorClick }: ColorHistoryProps) => {
  const { recentColors } = useHistory();

  return (
    <div className="menu-items">
      {recentColors.map((item, i) => (
        <MenuItem
          key={`${item.hex}-${i}`}
          item={item}
          color={item.hex}
          name={item.name}
          contrast={item.contrast}
          textBottomLeft={item.dateString}
          textBottomRight={item.timeString}
          onClick={handleColorClick}
        />
      ))}
    </div>
  );
};

export default ColorHistory;
