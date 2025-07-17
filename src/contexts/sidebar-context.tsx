import {
  createContext,
  useState,
  useContext,
  useMemo,
  useCallback,
} from 'react';

interface SidebarContextValue {
  isMenuOpen: boolean;
  closeMenu: () => void;
  openMenu: () => void;
  toggleMenu: () => void;
}

const SidebarContext = createContext<SidebarContextValue>({
  isMenuOpen: false,
  closeMenu: () => {},
  openMenu: () => {},
  toggleMenu: () => {},
});

interface SidebarProviderProps {
  children: React.ReactNode;
}

export const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(!isMenuOpen);
  }, [isMenuOpen]);

  const openMenu = useCallback(() => {
    setIsMenuOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const contextValue = useMemo(
    (): SidebarContextValue => ({
      isMenuOpen,
      toggleMenu,
      openMenu,
      closeMenu,
    }),
    [isMenuOpen, toggleMenu, openMenu, closeMenu],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);

export default SidebarContext;
