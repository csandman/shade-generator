import { createContext } from 'react';

const InputContext = createContext({
  inputValue1: '',
  inputValue2: '',
  updateInputValue: () => {}
});

export default InputContext;
