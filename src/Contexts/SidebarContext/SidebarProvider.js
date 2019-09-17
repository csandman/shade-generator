import React, { useState } from 'react'
import SidebarContext from './SidebarContext';

const SidebarProvider = ({ children }) => {

  const toggleMenu = () => {
    console.log('toggle menu')
    setSidebarValues(prevMenuValues => {
      let newMenuValues = {...prevMenuValues};
      newMenuValues.isMenuOpen = !prevMenuValues.isMenuOpen;
      console.log(newMenuValues)
      return newMenuValues;
    });
  }

  const openMenu = () => {
    setSidebarValues(prevMenuValues => {
      let newMenuValues = {...prevMenuValues};
      newMenuValues.isMenuOpen = true;
      return newMenuValues;
    });
  }

  const closeMenu = () => {
    setSidebarValues(prevMenuValues => {
      let newMenuValues = {...prevMenuValues};
      newMenuValues.isMenuOpen = false;
      return newMenuValues;
    });
  }

  const [sidebarValues, setSidebarValues] = useState({
    isMenuOpen: false,
    openMenu,
    closeMenu,
    toggleMenu
  })

  return (
    <SidebarContext.Provider value={sidebarValues}>
      {children}
    </SidebarContext.Provider>
  )
}

export default SidebarProvider;