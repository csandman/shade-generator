import React from "react";

const HeaderButton = ({
  action = () => {},
  className = "",
  splitViewDisabled = false,
  splitView = false,
  colorData = {},
  buttonText = "Button",
  iconClassName = "",
  textClassName = ""
}) => {
  return (
    <div
      className={`icon-button ${className}`}
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
        className={textClassName}
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
    </div>
  );
};

export default HeaderButton;
