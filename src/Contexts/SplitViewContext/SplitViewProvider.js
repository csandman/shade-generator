import { useState, useCallback, useEffect } from 'react';
import SplitViewContext from './SplitViewContext';

const isSplitViewDisabled = () => {
  return window.innerWidth <= 600;
};

const SplitViewProvider = ({ children }) => {
  const [splitView, setSplitView] = useState(null);
  const [splitViewDisabled, setSplitViewDisabled] = useState(
    isSplitViewDisabled()
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

  return (
    <SplitViewContext.Provider
      value={{ splitView, splitViewDisabled, setSplitView, toggleSplitView }}
    >
      {children}
    </SplitViewContext.Provider>
  );
};

export default SplitViewProvider;
