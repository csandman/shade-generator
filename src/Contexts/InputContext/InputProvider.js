import React, { useState } from 'react';
import InputContext from './InputContext';

const InputProvider = ({ children }) => {
  const updateInputValue = (inputNum, value) => {
    setInputValues(prevInputValues => ({
      ...prevInputValues,
      [`inputValue${inputNum}`]: value
    }));
  };

  const [inputValues, setInputValues] = useState({
    inputValue1: '',
    inputValue2: '',
    updateInputValue
  });

  return (
    <InputContext.Provider value={inputValues}>
      {children}
    </InputContext.Provider>
  );
};

export default InputProvider;
