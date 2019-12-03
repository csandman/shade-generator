import React, { createContext } from 'react';
import { useLocalStorage } from '../../Hooks';

const HistoryContext = createContext({
  splitView: false,
  splitViewDisabled: false,
  setSplitView: () => {},
  toggleSplitView: () => {}
});

const HistoryProvider = ({ children }) => {
  const [recentColors, setRecentColors] = useLocalStorage('recentColors', []);

  const updateRecentColors = newColor => {
    if (recentColors.length >= 100) {
      setRecentColors([newColor, ...recentColors.slice(1)]);
    } else {
      setRecentColors([newColor, ...recentColors]);
    }
  };

  return (
    <HistoryContext.Provider
      value={{
        recentColors,
        updateRecentColors
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export { HistoryProvider };

export default HistoryContext;
