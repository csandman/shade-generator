import { createContext, useRef, useContext } from 'react';
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

  const recentColorsRef = useRef(recentColors);

  const updateRecentColors = (newColor: ColorInfo) => {
    recentColorsRef.current = [
      newColor,
      ...recentColorsRef.current.slice(0, 100),
    ];
    setRecentColors(recentColorsRef.current);
  };

  return (
    <HistoryContext.Provider
      value={{
        recentColors,
        updateRecentColors,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => useContext(HistoryContext);

export default HistoryContext;
