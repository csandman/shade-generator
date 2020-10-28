import { createContext, useState, useContext } from 'react';

const SidebarContext = createContext({
  menuIsOpen: false,
  closeMenu: () => {},
  openMenu: () => {},
  toggleMenu: () => {},
});

const SidebarProvider = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openMenu = () => {
    setIsMenuOpen(true);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <SidebarContext.Provider
      value={{
        isMenuOpen,
        toggleMenu,
        openMenu,
        closeMenu,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

const useSidebar = () => {
  return useContext(SidebarContext);
};

export { SidebarContext as default, SidebarProvider, useSidebar };
