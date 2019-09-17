import React, {
    useRef,
    useEffect,
    useContext,
    useState,
    createContext
} from "react";

const InputContext = createContext({
    inputValue1: "",
    inputValue2: "",
    updateInputValue: (number, value) => {}
});

const InputProvider = ({ children }) => {
    /**
     * Loading state/controls
     */

    const updateInputValue = (inputNum, value) => {
        setInputValues(prevInputValues => {
            let newInputValues = { ...prevInputValues };
            newInputValues[`inputValue${inputNum}`] = value;
            return newInputValues;
        });
    };

    const [inputValues, setInputValues] = useState({
        inputValue1: "",
        inputValue2: "",
        updateInputValue
    });

    return (
        <InputContext.Provider value={inputValues}>
            {children}
        </InputContext.Provider>
    );
};

const usePrevious = value => {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};

const InputUpdater = ({ inputNum, inputValue }) => {
    const { updateInputValue } = useContext(InputContext);
    const prevProps = usePrevious({ inputNum, inputValue });
    useEffect(() => {
        if (!prevProps) return;
        if (
            inputNum !== prevProps.inputNum ||
            inputValue !== prevProps.inputValue
        ) {
            updateInputValue(inputNum, inputValue);
        }
    }, [inputNum, inputValue, updateInputValue, prevProps]);
    return null;
};

export { InputProvider, InputUpdater };

export default InputContext;
