import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './Components/App';
import * as serviceWorker from './serviceWorker';
import { FirebaseProvider } from './Contexts/FirebaseContext';
import { InputProvider } from './Contexts/InputContext';
import { SidebarProvider } from './Contexts/SidebarContext';
import { SplitViewProvider } from './Contexts/SplitViewContext';
import { HistoryProvider } from './Contexts/HistoryContext';

ReactDOM.render(
  <FirebaseProvider>
    <SidebarProvider>
      <SplitViewProvider>
        <InputProvider>
          <HistoryProvider>
            <App />
          </HistoryProvider>
        </InputProvider>
      </SplitViewProvider>
    </SidebarProvider>
  </FirebaseProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
