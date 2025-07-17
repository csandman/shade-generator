import { FaArrowLeft } from 'react-icons/fa';
import type { ReactNode } from 'react';

interface SubMenuProps {
  isOpen: boolean;
  title: string;
  onBack: () => void;
  children: ReactNode;
  id?: string;
}

const SubMenu = ({ isOpen, title, onBack, children, id }: SubMenuProps) => (
  <div className={`sub-menu${isOpen ? '' : ' hidden'}`} id={id}>
    <button type="button" onClick={onBack} className="sub-menu-header">
      <FaArrowLeft className="icon" />
      <span>{title}</span>
    </button>
    <div className="sub-menu-content">{children}</div>
  </div>
);

export default SubMenu;
