import { createContext, useRef, useContext } from 'react';
import useLocalStorageState from 'use-local-storage-state';

const HistoryContext = createContext({
  recentColors: [],
  updateRecentColors: () => {},
});

const HistoryProvider = ({ children }) => {
  const [recentColors, setRecentColors] = useLocalStorageState('recentColors', {
    defaultValue: [],
  });

  const recentColorsRef = useRef(recentColors);

  const updateRecentColors = (newColor) => {
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

const useHistory = () => {
  return useContext(HistoryContext);
};

export { HistoryContext as default, HistoryProvider, useHistory };
