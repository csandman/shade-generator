import { createContext, useState, useContext, useRef, useEffect } from 'react';

const InputContext = createContext({
  inputValue1: '',
  inputValue2: '',
  updateInputValue: () => {},
});

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

const useInput = () => {
  return useContext(InputContext);
};

const InputUpdater = ({ inputValue1, inputValue2 }) => {
  const prevInput1 = useRef('');
  const prevInput2 = useRef('');
  const { updateInputValue } = useContext(InputContext);
  useEffect(() => {
    if (inputValue1 !== prevInput1.current) {
      updateInputValue(1, inputValue1.current);
      prevInput1.current = inputValue1;
    }
    if (inputValue2 !== prevInput2.current) {
      updateInputValue(2, inputValue2.current);
      prevInput2.current = inputValue2;
    }
  });
  return null;
};

export { InputContext as default, InputProvider, useInput, InputUpdater };
