import React, { useContext } from 'react';
import SplitViewContext from '../../../Contexts/SplitViewContext';

const HeaderButton = ({
  action = () => {},
  className = '',
  colorData = {},
  buttonText = 'Button',
  iconClassName = '',
  textClassName = '',
  name = ''
}) => {
  const { splitView, splitViewDisabled } = useContext(SplitViewContext);

  return (
    <button
      name={name}
      aria-label={name}
      type="button"
      className={`button icon-button ${className}`}
      onClick={action}
      style={
        !splitView || splitViewDisabled
          ? {
              borderColor: colorData.contrast,
              color: colorData.contrast
            }
          : {}
      }
    >
      <i
        className={iconClassName}
        style={
          !splitView || splitViewDisabled
            ? {
                color: colorData.contrast
              }
            : {}
        }
      />
      <span
        className={`icon-button-text ${textClassName}`}
        style={
          !splitView || splitViewDisabled
            ? {
                borderColor: colorData.contrast,
                color: colorData.contrast
              }
            : {}
        }
      >
        {buttonText}
      </span>
    </button>
  );
};

export default HeaderButton;
