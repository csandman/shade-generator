import React from "react";
import ColorSquare from "../ColorSquare";
import "./BodyContent.scss";

const BodyContent = props => {
  return (
    <div
      className={
        props.splitView & !props.splitScreenDisabled
          ? "body-content split"
          : "body-content"
      }
    >
      <div className="input-container">
        <div className="color-input">
          <label htmlFor={"color-input-" + props.number}>
            Color code input {props.number}
          </label>
          <input
            id={"color-input-" + props.number}
            name={"inputValue" + props.number}
            type="search"
            placeholder="Color Code (Hex, RGB, or Name)"
            onChange={props.handleInputChange}
            data-number={props.number}
            value={props.inputValue}
            style={{ borderColor: props.colorData.contrast }}
          />
          <button
            onClick={() => props.handleSubmit(props.number)}
            name={"inputValue" + props.number}
            data-number={props.number}
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
              handleColorClick={props.handleColorClick}
              colorDataNumber={props.number}
              color={color}
              key={color + index}
              squareNumber={index + 1}
              addMenuItem={props.addMenuItem}
            />
          );
        })}
      </div>
    </div>
  );
};

export default BodyContent;
