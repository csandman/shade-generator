import { memo } from 'react';
import { useSplitView } from 'contexts/split-view-context';
import HamburgerButton from 'Components/HamburgerButton';
import type { ColorInfo } from 'utils/color';
import { FaColumns, FaRandom } from 'react-icons/fa';
import HeaderIcon from './HeaderIcon';
import HeaderButton from './HeaderButton';
import './Header.scss';

interface HeaderProps {
  colorData: ColorInfo;
  getRandomColors: () => void;
}

const Header = ({ colorData, getRandomColors }: HeaderProps) => {
  const { splitView, splitViewDisabled, toggleSplitView } = useSplitView();

  return (
    <div
      id="header"
      style={
        !splitView || splitViewDisabled
          ? {
              borderColor: colorData.contrast,
              backgroundColor: colorData.hex,
            }
          : {}
      }
    >
      <div className="left-content">
        {colorData.shades.length && (
          <HeaderIcon getRandomColors={getRandomColors} colorData={colorData} />
        )}
        <h1
          style={
            !splitView || splitViewDisabled ? { color: colorData.contrast } : {}
          }
        >
          Shade Generator
        </h1>
      </div>
      <div className="right-content">
        <div className="button-section">
          <HeaderButton
            name="Get random color"
            action={getRandomColors}
            className="random-button"
            colorData={colorData}
            buttonText="Random"
            icon={FaRandom}
            textClassName="random-button-text"
          />
          <HeaderButton
            name="Toggle split view"
            action={toggleSplitView}
            className={`split-button ${splitView ? ' active' : ''}`}
            colorData={colorData}
            buttonText="Split View"
            icon={FaColumns}
            textClassName="split-button-text"
          />
        </div>
        <HamburgerButton
          color={
            !splitView || splitViewDisabled ? colorData.contrast : '#7a7a7a'
          }
        />
      </div>
    </div>
  );
};

export default memo(Header);
