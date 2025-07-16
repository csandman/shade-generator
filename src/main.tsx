import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './fonts';
import App from 'Components/App';
import * as serviceWorker from 'serviceWorker';
// import { FirebaseProvider } from "contexts/firebase-context";
import { InputProvider } from 'contexts/input-context';
import { SidebarProvider } from 'contexts/sidebar-context';
import { SplitViewProvider } from 'contexts/split-view-context';
import { HistoryProvider } from 'contexts/history-context';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <FirebaseProvider> */}
    <SidebarProvider>
      <SplitViewProvider>
        <InputProvider>
          <HistoryProvider>
            <App />
          </HistoryProvider>
        </InputProvider>
      </SplitViewProvider>
    </SidebarProvider>
    {/* </FirebaseProvider> */}
  </StrictMode>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
