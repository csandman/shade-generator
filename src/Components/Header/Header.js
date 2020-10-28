import { memo, useContext } from 'react';
import SplitViewContext from 'Contexts/SplitViewContext';
import HamburgerButton from 'Components/HamburgerButton';
import HeaderIcon from './HeaderIcon/HeaderIcon';
import HeaderButton from './HeaderButton/HeaderButton';
import './Header.scss';

const Header = ({ colorData, getRandomColors }) => {
  const { splitView, splitViewDisabled, toggleSplitView } = useContext(
    SplitViewContext
  );

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
            !splitView || splitViewDisabled
              ? {
                  color: colorData.contrast,
                }
              : {}
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
            iconClassName="fas fa-random"
            textClassName="random-button-text"
          />
          <HeaderButton
            name="Toggle split view"
            action={toggleSplitView}
            className={`split-button ${splitView ? ' active' : ''}`}
            colorData={colorData}
            buttonText="Split View"
            iconClassName="fas fa-columns"
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
