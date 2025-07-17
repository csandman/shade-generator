import { createContext, useCallback, useContext, useMemo } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import type { ColorInfo } from 'utils/color';

interface HistoryContextValue {
  recentColors: ColorInfo[];
  updateRecentColors: (newColor: ColorInfo) => void;
}

const HistoryContext = createContext<HistoryContextValue>({
  recentColors: [],
  updateRecentColors: () => {},
});

interface HistoryProviderProps {
  children: React.ReactNode;
}

export const HistoryProvider = ({ children }: HistoryProviderProps) => {
  const [recentColors, setRecentColors] = useLocalStorageState<ColorInfo[]>(
    'recentColors',
    {
      defaultValue: [],
    },
  );

  const updateRecentColors = useCallback(
    (newColor: ColorInfo) => {
      setRecentColors((prevRecentColors) => [
        newColor,
        ...prevRecentColors.slice(0, 99),
      ]);
    },
    [setRecentColors],
  );

  const contextValue = useMemo(
    () => ({ recentColors, updateRecentColors }),
    [recentColors, updateRecentColors],
  );

  return (
    <HistoryContext.Provider value={contextValue}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => useContext(HistoryContext);

export default HistoryContext;
