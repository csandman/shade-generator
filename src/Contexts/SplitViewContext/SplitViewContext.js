import { createContext } from "react";

const SplitViewContext = createContext({
  splitView: false,
  splitViewDisabled: false,
  setSplitView: () => {},
  toggleSplitView: () => {}
});

export default SplitViewContext;
