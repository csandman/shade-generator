import React, { useState } from 'react';
import SplitViewContext from './SplitViewContext';
import { useEventListener } from '../../Hooks';

const isSplitViewDisabled = () => {
  const width = window.innerWidth;
  if (width <= 600) {
    return true;
  }
  return false;
};

const SplitViewProvider = ({ children }) => {
  useEventListener('resize', () => {
    const splitViewDisabled = isSplitViewDisabled();
    if (splitViewDisabled !== splitViewValues.splitViewDisabled) {
      setSplitViewValues(prevSplitViewValues => ({
        ...prevSplitViewValues,
        splitViewDisabled
      }));
    }
  });

  const setSplitView = splitView => {
    setSplitViewValues(prevSplitViewValues => ({
      ...prevSplitViewValues,
      splitView
    }));
  };

  const toggleSplitView = () => {
    setSplitViewValues(prevSplitViewValues => ({
      ...prevSplitViewValues,
      splitView: !prevSplitViewValues.splitView
    }));
  };

  const [splitViewValues, setSplitViewValues] = useState({
    splitView: null,
    splitViewDisabled: isSplitViewDisabled(),
    setSplitView,
    toggleSplitView
  });

  return (
    <SplitViewContext.Provider value={splitViewValues}>
      {children}
    </SplitViewContext.Provider>
  );
};

export default SplitViewProvider;
