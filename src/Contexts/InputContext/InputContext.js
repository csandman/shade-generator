import { createContext } from 'react';

const InputContext = createContext({
  inputValue1: '',
  inputValue2: '',
  updateInputValue: (number, value) => {}
});

export default InputContext;