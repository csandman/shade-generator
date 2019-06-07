import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
  useRef
} from "react";

import InputContext from '../../Contexts/InputContext';

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const InputUpdater = ({inputNum, inputValue}) => {
  const { updateInputValue } = useContext(InputContext);
  const prevProps = usePrevious({ inputNum, inputValue });
  useEffect(() => {
    if (!prevProps) return;
    if (inputNum !== prevProps.inputNum || inputValue !== prevProps.inputValue) {
      updateInputValue(inputNum, inputValue);
    }
  }, [inputNum, inputValue]);
  return null;
}

export default InputUpdater;