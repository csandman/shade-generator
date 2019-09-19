import { useEffect, useContext, useRef } from "react";

import InputContext from "../../Contexts/InputContext";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const InputUpdater = ({ inputValue1, inputValue2 }) => {
  const { updateInputValue } = useContext(InputContext);
  const prevProps = usePrevious({ inputValue1, inputValue2 });
  useEffect(() => {
    if (!prevProps) return;
    if (inputValue1 !== prevProps.inputValue1) {
      updateInputValue(1, inputValue1);
    }
    if (inputValue2 !== prevProps.inputValue2) {
      updateInputValue(2, inputValue2);
    }
  });
  return null;
};

export default InputUpdater;
