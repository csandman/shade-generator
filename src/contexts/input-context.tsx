import { createContext, useState, useContext, useRef, useEffect } from 'react';

type UpdateInputValue = (inputNum: number, value: string) => void;

interface InputContextValue {
  inputValue1: string;
  inputValue2: string;
  updateInputValue: UpdateInputValue;
}

const InputContext = createContext<InputContextValue>({
  inputValue1: '',
  inputValue2: '',
  updateInputValue: () => {},
});

interface InputProviderProps {
  children: React.ReactNode;
}

export const InputProvider = ({ children }: InputProviderProps) => {
  const [inputValues, setInputValues] = useState({
    inputValue1: '',
    inputValue2: '',
  });

  const updateInputValue = (inputNum: number, value: string) => {
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

export const useInput = () => useContext(InputContext);

interface InputUpdaterProps {
  inputValue1: string;
  inputValue2: string;
}

export const InputUpdater = ({
  inputValue1,
  inputValue2,
}: InputUpdaterProps) => {
  const prevInput1 = useRef('');
  const prevInput2 = useRef('');
  const { updateInputValue } = useInput();

  useEffect(() => {
    if (inputValue1 !== prevInput1.current) {
      updateInputValue(1, inputValue1);
      prevInput1.current = inputValue1;
    }
    if (inputValue2 !== prevInput2.current) {
      updateInputValue(2, inputValue2);
      prevInput2.current = inputValue2;
    }
  }, [inputValue1, inputValue2, updateInputValue]);

  return null;
};

export default InputContext;
