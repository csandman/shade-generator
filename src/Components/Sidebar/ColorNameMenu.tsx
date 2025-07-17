import { useState, useRef, useEffect, useMemo } from 'react';
import Color from 'color';
import { colornames as namedColors, type ColorName } from 'color-name-list';
import { useSidebar } from 'contexts/sidebar-context';
import { getContrastColor } from 'utils/color';
import type { ColorCallback } from 'types/app';

interface ColorNameWithContrast extends ColorName {
  contrast: string;
}

const initialColorNameList = namedColors.map<ColorNameWithContrast>(
  (color) => ({
    ...color,
    contrast: getContrastColor(Color(color.hex)).hex(),
  }),
);

interface ColorNameMenuProps {
  handleColorClick: ColorCallback;
  isOpen: boolean;
}

const ColorNameMenu = ({ handleColorClick, isOpen }: ColorNameMenuProps) => {
  const { closeMenu } = useSidebar();

  const inputEl = useRef<HTMLInputElement>(null);
  const inputElTimeout = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    if (inputElTimeout.current) {
      clearTimeout(inputElTimeout.current);
    }
    if (isOpen && inputEl.current) {
      inputElTimeout.current = setTimeout(() => {
        inputEl.current?.select();
      }, 310);
    } else {
      inputEl.current?.blur();
    }
  }, [isOpen]);

  const [searchInput, setSearchInput] = useState('');

  const colorNames = useMemo(() => {
    if (!searchInput) {
      return initialColorNameList.slice(0, 100);
    }
    return initialColorNameList
      .filter((color) =>
        color.name
          .replace(/\s/g, '')
          .toLowerCase()
          .includes(searchInput.replace(/\s/g, '').toLowerCase()),
      )
      .slice(0, 100);
  }, [searchInput]);

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
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      <div className="sub-menu-content">
        <div className="menu-items">
          {colorNames.map((color, i) => (
            <div
              key={`${color.name}-${i}`}
              className="color-result-item"
              style={{ background: color.hex, color: color.contrast }}
              onClick={() => {
                handleColorClick(color.hex, 1);
                closeMenu();
              }}
            >
              {color.name}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ColorNameMenu;
