import React, { useContext } from "react";
import InputContext from '../../Contexts/InputContext';

const ColorInput = props => {
  const { bodyNum } = props;


  const inputValue = useContext(InputContext)[`inputValue${bodyNum}`];
  const { updateInputValue } = useContext(InputContext);

  function handleKeyPress(e) {
    console.log(e, e.key)
    if (e.key === "Enter") {
      if (document.activeElement.id !== "color-search") {
        props.handleSubmit(bodyNum, inputValue);
      }
    }
  }


  return (
    <div className="color-input">
      <label htmlFor={"color-input-" + bodyNum}>
        Color code input {bodyNum}
      </label>
      <input
        name={"inputValue" + bodyNum}
        type="search"
        placeholder="Color Code (Hex, RGB, or Name)"
        onChange={e => {
          updateInputValue(bodyNum, e.target.value); 
        }}
        onKeyPress={handleKeyPress}
        value={inputValue}
        style={{ borderColor: props.contrast }}
      />
      <button
        onClick={() => {
          console.log(inputValue, bodyNum)
          props.handleSubmit(bodyNum, inputValue)
        }}
        name={"inputValue" + bodyNum}
        style={{
          borderColor: props.contrast,
          backgroundColor: props.contrast,
          color: props.oppositeContrast
        }}
      >
        GO
      </button>
    </div>
  );
};

export default ColorInput;
