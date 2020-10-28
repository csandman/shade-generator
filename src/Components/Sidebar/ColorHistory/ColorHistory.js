import { useHistory } from 'contexts/history-context';
import MenuItem from '../MenuItem/MenuItem';

const ColorHistory = ({ handleColorClick }) => {
  const { recentColors } = useHistory();

  return (
    <div className="menu-items">
      {recentColors.map((item, i) => {
        return (
          <MenuItem
            key={item.hex + i}
            item={item}
            color={item.hex}
            name={item.name}
            contrast={item.contrast}
            textBottomLeft={item.dateString}
            textBottomRight={item.timeString}
            onClick={handleColorClick}
          />
        );
      })}
    </div>
  );
};

export default ColorHistory;
