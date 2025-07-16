import { useSidebar } from 'contexts/sidebar-context';
import { useSplitView } from 'contexts/split-view-context';

function MenuItem({
  color = '#222',
  onClick = () => {},
  contrast = '#8A8A8A',
  name = 'Black Out',
  textBottomLeft = '',
  textBottomRight = '',
  item,
}) {
  const { closeMenu } = useSidebar();
  const { splitView } = useSplitView();

  function handleMainClick() {
    closeMenu();
    onClick(item, 1);
  }

  function handleSubClick(e) {
    closeMenu();
    // console.log(e.currentTarget.dataset.index);
    // console.log(item);
    onClick(item, Number(e.currentTarget.dataset.index));
    e.stopPropagation();
  }

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
          <div className="panel left" onClick={handleSubClick} data-index={1}>
            <span className="panel-text">Apply to Left</span>
          </div>
          <div className="panel right" onClick={handleSubClick} data-index={2}>
            <span className="panel-text">Apply to Right</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default MenuItem;
