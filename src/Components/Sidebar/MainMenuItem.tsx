import type { IconType } from 'react-icons';

interface MainMenuItemProps {
  id: string;
  icon: IconType;
  label: string;
  onClick: (id: string) => void;
}

const MainMenuItem = ({
  id,
  icon: Icon,
  label,
  onClick,
}: MainMenuItemProps) => (
  <div
    className="main-menu-item"
    id={id}
    onClick={(e) => onClick(e.currentTarget.id)}
  >
    <Icon className="icon" />
    <span>{label}</span>
  </div>
);

export default MainMenuItem;
