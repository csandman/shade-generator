import { useSidebar } from 'contexts/sidebar-context';
import { useSplitView } from 'contexts/split-view-context';
import type { BodyNumber, ColorCallback } from 'types/app';
import type { ColorInfo } from 'utils/color';

interface MenuItemProps {
  color: string;
  onClick: ColorCallback;
  contrast: string;
  name: string;
  textBottomLeft?: string;
  textBottomRight?: string;
  item: ColorInfo;
}

const MenuItem = ({
  color,
  onClick,
  contrast,
  name,
  textBottomLeft,
  textBottomRight,
  item,
}: MenuItemProps) => {
  const { closeMenu } = useSidebar();
  const { splitView } = useSplitView();

  const handleMainClick = () => {
    closeMenu();
    onClick(item, 1);
  };

  const handleSubClick = (num: BodyNumber) => {
    closeMenu();
    onClick(item, num);
  };

  return (
    <div
      className="menu-item"
      style={{ backgroundColor: color, color: contrast }}
      onClick={handleMainClick}
      data-hex={color}
    >
      <div className="color-name">{name}</div>
      <div className="color-name">{color}</div>
      <div className="footer-left">{textBottomLeft}</div>
      <div className="footer-right">{textBottomRight}</div>
      {splitView && (
        <div className="menu-item-overlay">
          <div className="panel left" onClick={() => handleSubClick(1)}>
            <span className="panel-text">Apply to Left</span>
          </div>
          <div className="panel right" onClick={() => handleSubClick(2)}>
            <span className="panel-text">Apply to Right</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuItem;
