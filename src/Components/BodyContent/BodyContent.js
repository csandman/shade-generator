import React from "react";
import ColorSquare from "../ColorSquare";
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
          <div className="color-input">
            <label htmlFor={"color-input-" + props.bodyNum}>
              Color code input {props.bodyNum}
            </label>
            <input
              name={"inputValue" + props.bodyNum}
              type="search"
              placeholder="Color Code (Hex, RGB, or Name)"
              onChange={props.handleInputChange}
              data-number={props.bodyNum}
              value={props.inputValue}
              style={{ borderColor: props.colorData.contrast }}
            />
            <button
              onClick={() => props.handleSubmit(props.bodyNum)}
              name={"inputValue" + props.bodyNum}
              data-number={props.bodyNum}
              style={{
                borderColor: props.colorData.contrast,
                backgroundColor: props.colorData.contrast,
                color: props.colorData.oppositeContrast
              }}
            >
              GO
            </button>
          </div>
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
