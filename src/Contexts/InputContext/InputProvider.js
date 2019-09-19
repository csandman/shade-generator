import React, { useState } from "react";
import InputContext from "./InputContext";

const InputProvider = ({ children }) => {
  const updateInputValue = (inputNum, value) => {
    setInputValues(prevInputValues => {
      let newInputValues = { ...prevInputValues };
      newInputValues[`inputValue${inputNum}`] = value;
      return newInputValues;
    });
  };

  const [inputValues, setInputValues] = useState({
    inputValue1: "",
    inputValue2: "",
    updateInputValue
  });

  return (
    <InputContext.Provider value={inputValues}>
      {children}
    </InputContext.Provider>
  );
};

export default InputProvider;
