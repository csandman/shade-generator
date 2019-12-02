import React, { useContext } from 'react';
import SplitViewContext from '../../../Contexts/SplitViewContext';

const HeaderButton = ({
  action = () => {},
  className = '',
  colorData = {},
  buttonText = '',
  iconClassName = '',
  textClassName = '',
  name = ''
}) => {
  const { splitView, splitViewDisabled } = useContext(SplitViewContext);

  const colorStyles =
    !splitView || splitViewDisabled
      ? {
          borderColor: colorData.contrast,
          color: colorData.contrast
        }
      : {};

  return (
    <button
      name={name}
      aria-label={name}
      type="button"
      className={`button icon-button ${className}`}
      onClick={action}
      style={colorStyles}
    >
      <i className={iconClassName} style={colorStyles} />
      <span className={`icon-button-text ${textClassName}`} style={colorStyles}>
        {buttonText}
      </span>
    </button>
  );
};

export default HeaderButton;
