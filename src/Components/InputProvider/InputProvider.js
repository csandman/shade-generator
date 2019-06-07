import React, { useState } from 'react'
import InputContext from '../../Contexts/InputContext';

const InputProvider = ({ children }) => {
  /**
   * Loading state/controls
   */

  const updateInputValue = (inputNum, value) => {
    setInputValues(prevInputValues => {
      let newInputValues = {...prevInputValues};
      newInputValues[`inputValue${inputNum}`] = value;
      return newInputValues;
    }) 
    
  }

  const [inputValues, setInputValues] = useState({
    inputValue1: '',
    inputValue2: '',
    updateInputValue
  })

  return (
    <InputContext.Provider value={inputValues}>
      {children}
    </InputContext.Provider>
  )
}

export default InputProvider;