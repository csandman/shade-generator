import React, { useState } from 'react';
import InputContext from './InputContext';

const InputProvider = ({ children }) => {
  const [inputValues, setInputValues] = useState({
    inputValue1: '',
    inputValue2: '',
  });

  const updateInputValue = (inputNum, value) => {
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [`inputValue${inputNum}`]: value,
    }));
  };

  return (
    <InputContext.Provider value={{ ...inputValues, updateInputValue }}>
      {children}
    </InputContext.Provider>
  );
};

export default InputProvider;
