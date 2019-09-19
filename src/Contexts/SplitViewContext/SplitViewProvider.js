import React, { useState } from "react";
import SplitViewContext from "./SplitViewContext";
import { useEventListener } from "../../Hooks";

const isSplitViewDisabled = () => {
  const width = window.innerWidth;
  if (width <= 600) {
    return true;
  } else {
    return false;
  }
};

const SplitViewProvider = ({ children }) => {
  useEventListener("resize", () => {
    let splitViewDisabled = isSplitViewDisabled();
    if (splitViewDisabled !== splitViewValues.splitViewDisabled) {
      setSplitViewValues(prevSplitViewValues => {
        let newSplitViewValues = {
          ...prevSplitViewValues,
          splitViewDisabled
        };
        return newSplitViewValues;
      });
    }
  });

  const setSplitView = splitView => {
    setSplitViewValues(prevSplitViewValues => {
      let newSplitViewValues = { ...prevSplitViewValues, splitView };
      return newSplitViewValues;
    });
  };

  const toggleSplitView = () => {
    setSplitViewValues(prevSplitViewValues => {
      let newSplitViewValues = {
        ...prevSplitViewValues,
        splitView: !prevSplitViewValues.splitView
      };
      return newSplitViewValues;
    });
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
