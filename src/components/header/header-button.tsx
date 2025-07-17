import { useSplitView } from 'contexts/split-view-context';
import type { IconType } from 'react-icons';
import type { ColorInfo } from 'utils/color';

interface HeaderButtonProps {
  action: () => void;
  className: string;
  colorData: ColorInfo;
  buttonText: string;
  icon: IconType;
  textClassName: string;
  name: string;
}

const HeaderButton = ({
  action,
  className,
  colorData,
  buttonText,
  icon: Icon,
  textClassName,
  name,
}: HeaderButtonProps) => {
  const { splitView, splitViewDisabled } = useSplitView();

  const colorStyles =
    !splitView || splitViewDisabled
      ? {
          borderColor: colorData.contrast,
          color: colorData.contrast,
        }
      : {};

  return (
    <button
      name={name}
      aria-label={name}
      type="button"
      className={`button icon-button ${className}`}
      onClick={action}
      style={colorStyles}
    >
      <Icon style={colorStyles} size={20} />
      <span className={`icon-button-text ${textClassName}`} style={colorStyles}>
        {buttonText}
      </span>
    </button>
  );
};

export default HeaderButton;
