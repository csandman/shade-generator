import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./Components/App";
import * as serviceWorker from "./serviceWorker";
import Firebase, { FirebaseContext } from "./Components/Firebase";
import { InputProvider } from "./Contexts/InputContext";
import { SidebarProvider } from "./Contexts/SidebarContext";
import { SplitViewProvider } from "./Contexts/SplitViewContext";

ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <SidebarProvider>
      <SplitViewProvider>
        <InputProvider>
          <App />
        </InputProvider>
      </SplitViewProvider>
    </SidebarProvider>
  </FirebaseContext.Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
