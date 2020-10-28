import { useState, useCallback } from 'react';
import SplitViewContext from './SplitViewContext';
import { useEventListener } from '../../Hooks';

const isSplitViewDisabled = () => {
  return window.innerWidth <= 600;
};

const SplitViewProvider = ({ children }) => {
  const [splitView, setSplitView] = useState(null);
  const [splitViewDisabled, setSplitViewDisabled] = useState(
    isSplitViewDisabled()
  );

  useEventListener('resize', () => {
    setSplitViewDisabled(isSplitViewDisabled());
  });

  const toggleSplitView = useCallback(() => {
    setSplitView((prevSplitView) => !prevSplitView);
  }, []);

  return (
    <SplitViewContext.Provider
      value={{ splitView, splitViewDisabled, setSplitView, toggleSplitView }}
    >
      {children}
    </SplitViewContext.Provider>
  );
};

export default SplitViewProvider;
