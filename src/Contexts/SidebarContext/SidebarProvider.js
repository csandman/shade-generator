import React, { useState } from 'react';
import SidebarContext from './SidebarContext';

const SidebarProvider = ({ children }) => {
  const toggleMenu = () => {
    setSidebarValues(prevMenuValues => {
      const newMenuValues = {
        ...prevMenuValues,
        isMenuOpen: !prevMenuValues.isMenuOpen
      };
      return newMenuValues;
    });
  };

  const openMenu = () => {
    setSidebarValues(prevMenuValues => {
      const newMenuValues = {
        ...prevMenuValues,
        isMenuOpen: true
      };
      return newMenuValues;
    });
  };

  const closeMenu = () => {
    setSidebarValues(prevMenuValues => {
      const newMenuValues = {
        ...prevMenuValues,
        isMenuOpen: false
      };
      return newMenuValues;
    });
  };

  const [sidebarValues, setSidebarValues] = useState({
    isMenuOpen: false,
    openMenu,
    closeMenu,
    toggleMenu
  });

  return (
    <SidebarContext.Provider value={sidebarValues}>
      {children}
    </SidebarContext.Provider>
  );
};

export default SidebarProvider;
