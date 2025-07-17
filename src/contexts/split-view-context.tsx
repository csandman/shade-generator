import {
  createContext,
  useState,
  useCallback,
  useEffect,
  useContext,
  useMemo,
} from 'react';

interface SplitViewContextValue {
  splitView: boolean | null;
  splitViewDisabled: boolean;
  setSplitView: (newSplitView: boolean) => void;
  toggleSplitView: () => void;
}

const SplitViewContext = createContext<SplitViewContextValue>({
  splitView: false,
  splitViewDisabled: false,
  setSplitView: () => {},
  toggleSplitView: () => {},
});

const isSplitViewDisabled = () => {
  return window.innerWidth <= 600;
};

interface SplitViewProviderProps {
  children: React.ReactNode;
}

export const SplitViewProvider = ({ children }: SplitViewProviderProps) => {
  const [splitView, setSplitView] = useState<boolean | null>(null);
  const [splitViewDisabled, setSplitViewDisabled] = useState(
    isSplitViewDisabled(),
  );

  const toggleSplitView = useCallback(() => {
    setSplitView((prevSplitView) => !prevSplitView);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setSplitViewDisabled(isSplitViewDisabled());
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const contextValue = useMemo(
    (): SplitViewContextValue => ({
      splitView,
      splitViewDisabled,
      setSplitView,
      toggleSplitView,
    }),
    [splitView, splitViewDisabled, setSplitView, toggleSplitView],
  );

  return (
    <SplitViewContext.Provider value={contextValue}>
      {children}
    </SplitViewContext.Provider>
  );
};

export const useSplitView = () => {
  return useContext(SplitViewContext);
};

export default SplitViewContext;
