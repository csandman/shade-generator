import { createContext } from 'react';

const SidebarContext = createContext({
  menuIsOpen: false,
  closeMenu: () => {},
  openMenu: () => {},
  toggleMenu: () => {}
});

export default SidebarContext;
