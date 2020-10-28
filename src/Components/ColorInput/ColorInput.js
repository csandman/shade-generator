import React, { useContext } from 'react';
import InputContext from '../../Contexts/InputContext';

const ColorInput = ({ bodyNum, handleSubmit, contrast, oppositeContrast }) => {
  const inputContext = useContext(InputContext);
  const inputValue = inputContext[`inputValue${bodyNum}`];
  const { updateInputValue } = inputContext;

  function handleKeyPress(e) {
    // console.log(e, e.key);
    if (e.key === 'Enter') {
      if (document.activeElement.id !== 'color-search') {
        handleSubmit(bodyNum, inputValue);
      }
    }
  }

  return (
    <div className="color-input">
      <label htmlFor={`color-input-${bodyNum}`}>
        Color code input {bodyNum}
      </label>
      <input
        name={`inputValue${bodyNum}`}
        id={`color-input-${bodyNum}`}
        type="search"
        placeholder="Color Code (Hex, RGB, or Name)"
        onChange={(e) => {
          updateInputValue(bodyNum, e.target.value);
        }}
        onKeyPress={handleKeyPress}
        value={inputValue}
        style={{ borderColor: contrast }}
      />
      <button
        type="button"
        onClick={() => handleSubmit(bodyNum, inputValue)}
        name={`inputValue${bodyNum}`}
        style={{
          borderColor: contrast,
          backgroundColor: contrast,
          color: oppositeContrast,
        }}
      >
        GO
      </button>
    </div>
  );
};

export default ColorInput;
