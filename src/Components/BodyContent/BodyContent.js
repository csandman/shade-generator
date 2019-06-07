import React from "react";
import ColorSquare from "../ColorSquare";
import ColorInput from "../ColorInput";
import "./BodyContent.scss";

const BodyContent = props => {
  return (
    <div
      className="content-background"
      style={{ backgroundColor: props.colorData.hex }}
    >
      <div
        className={
          props.splitView & !props.splitViewDisabled
            ? "body-content split"
            : "body-content"
        }
      >
        <div className="input-container">
          <ColorInput 
            handleInputChange={props.handleInputChange}
            handleSubmit={props.handleSubmit}
            inputValue={props.inputValue}
            bodyNum={props.bodyNum}
            contrast={props.colorData.contrast}
            oppositeContrast={props.colorData.oppositeContrast} />
          <div
            className="color-name"
            style={{ color: props.colorData.contrast }}
          >
            {props.colorData.name}
          </div>
        </div>
        <div className="container">
          {props.colorData.shades.map((color, index) => {
            return (
              <ColorSquare
                hex={color.hex}
                handleColorClick={props.handleColorClick}
                bodyNum={props.bodyNum}
                color={color}
                key={color + index}
                squareNumber={index + 1}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BodyContent;
