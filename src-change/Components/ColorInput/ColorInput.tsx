import { useInput } from 'contexts/input-context';
import type { BodyNumber } from 'types/app';

interface ColorInputProps {
  bodyNum: BodyNumber;
  handleSubmit: (bodyNum: BodyNumber, inputValue: string) => void;
  contrast: string;
  oppositeContrast: string;
}

const ColorInput = ({
  bodyNum,
  handleSubmit,
  contrast,
  oppositeContrast,
}: ColorInputProps) => {
  const inputContext = useInput();

  const inputValue =
    bodyNum === 1 ? inputContext.inputValue1 : inputContext.inputValue2;
  const { updateInputValue } = inputContext;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && document.activeElement?.id !== 'color-search') {
      handleSubmit(bodyNum, inputValue);
    }
  };

  return (
    <div className="color-input">
      <label htmlFor={`color-input-${bodyNum}`}>
        Color code input {bodyNum}
      </label>
      <input
        name={`inputValue${bodyNum}`}
        id={`color-input-${bodyNum}`}
        type="search"
        placeholder="Color Code (Hex, RGB, or Name)"
        onChange={(e) => {
          updateInputValue(bodyNum, e.target.value);
        }}
        onKeyDown={handleKeyDown}
        value={inputValue}
        style={{ borderColor: contrast }}
      />
      <button
        type="button"
        onClick={() => handleSubmit(bodyNum, inputValue)}
        name={`inputValue${bodyNum}`}
        style={{
          borderColor: contrast,
          backgroundColor: contrast,
          color: oppositeContrast,
        }}
      >
        GO
      </button>
    </div>
  );
};

export default ColorInput;
