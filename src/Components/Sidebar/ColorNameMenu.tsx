import { useState, useRef, useEffect, useMemo } from 'react';
import Color from 'color';
import { colornames, type ColorName } from 'color-name-list';
import { useSidebar } from 'contexts/sidebar-context';
import { getContrastColor } from 'utils/color';
import type { ColorCallback } from 'types/app';
import { FaSearch } from 'react-icons/fa';

interface ColorNameWithContrast extends ColorName {
  contrast: string;
}

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

  const colorNamesWithContrast = useMemo(() => {
    if (!searchInput) {
      return colornames.slice(0, 50).map<ColorNameWithContrast>((color) => ({
        ...color,
        contrast: getContrastColor(Color(color.hex)).hex(),
      }));
    }
    return colornames
      .filter((color) =>
        color.name
          .replace(/\s/g, '')
          .toLowerCase()
          .includes(searchInput.replace(/\s/g, '').toLowerCase()),
      )
      .slice(0, 100)
      .map<ColorNameWithContrast>((color) => ({
        ...color,
        contrast: getContrastColor(Color(color.hex)).hex(),
      }));
  }, [searchInput]);

  return (
    <>
      <div className="search-input-container">
        <FaSearch className="icon" />
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
          {colorNamesWithContrast.map((color, i) => (
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
