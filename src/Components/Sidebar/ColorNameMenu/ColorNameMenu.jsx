import { useState, useRef, useEffect } from 'react';
import Color from 'color';
import { colornames as namedColors } from 'color-name-list';
import { useSidebar } from 'contexts/sidebar-context';
import { getContrastColor } from 'Functions';

const initialColorNameList = namedColors.slice(0, 50).map((color) => ({
  ...color,
  contrast: getContrastColor(Color(color.hex)).hex(),
}));

const ColorNameMenu = ({ handleColorClick, isOpen }) => {
  const { closeMenu } = useSidebar();

  const inputEl = useRef(null);
  const inputElTimeout = useRef();

  useEffect(() => {
    clearTimeout(inputElTimeout.current);
    if (isOpen) {
      inputElTimeout.current = setTimeout(() => {
        inputEl.current.select();
      }, 310);
    } else {
      inputEl.current.blur();
    }
  }, [isOpen]);

  const [searchInput, updateSearchInput] = useState('');
  const [colorNameList, updateColorNameList] = useState(initialColorNameList);

  const searchColorNames = (e) => {
    updateSearchInput(e.target.value);
    const newColorArr = [];
    let index = 0;
    while (newColorArr.length < 100 && index < namedColors.length) {
      if (
        namedColors[index].name
          .replace(/\s/g, '')
          .toLowerCase()
          .indexOf(e.target.value.replace(/\s/g, '').toLowerCase()) >= 0
      ) {
        newColorArr.push(namedColors[index]);
      }
      index += 1;
    }
    newColorArr.map((el) => ({
      ...el,
      contrast: getContrastColor(Color(el.hex)).hex(),
    }));
    updateColorNameList(newColorArr);
  };

  return (
    <>
      <div className="search-input-container">
        <div className="search-icon-container">
          <i className="icon fas fa-search" />
        </div>
        <label htmlFor="color-search">Color search</label>
        <input
          ref={inputEl}
          id="color-search"
          type="search"
          placeholder="Search..."
          value={searchInput}
          onChange={searchColorNames}
        />
      </div>

      <div className="sub-menu-content">
        <div className="menu-items">
          {colorNameList.map((color, i) => {
            return (
              <div
                key={color + i}
                className="color-result-item"
                style={{ background: color.hex, color: color.contrast }}
                onClick={() => {
                  handleColorClick(color.hex, 1);
                  closeMenu();
                }}
              >
                {color.name}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ColorNameMenu;
