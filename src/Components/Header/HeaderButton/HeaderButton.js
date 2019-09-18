import React, { useContext } from "react";
import SplitViewContext from "../../../Contexts/SplitViewContext";

const HeaderButton = ({
  action = () => {},
  className = "",
  colorData = {},
  buttonText = "Button",
  iconClassName = "",
  textClassName = ""
}) => {
  const { splitView, splitViewDisabled } = useContext(SplitViewContext);

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
    </div>
  );
};

export default HeaderButton;
