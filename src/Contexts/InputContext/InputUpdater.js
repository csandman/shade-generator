import { useEffect, useContext } from 'react';

import InputContext from './InputContext';

let prevInput1 = '';
let prevInput2 = '';

const InputUpdater = ({ inputValue1, inputValue2 }) => {
  const { updateInputValue } = useContext(InputContext);
  useEffect(() => {
    if (inputValue1 !== prevInput1) {
      updateInputValue(1, inputValue1);
      prevInput1 = inputValue1;
    }
    if (inputValue2 !== prevInput2) {
      updateInputValue(2, inputValue2);
      prevInput2 = inputValue2;
    }
  });
  return null;
};

export default InputUpdater;
