import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './fonts';
import App from 'components/app';
import { InputProvider } from 'contexts/input-context';
import { SidebarProvider } from 'contexts/sidebar-context';
import { SplitViewProvider } from 'contexts/split-view-context';
import { HistoryProvider } from 'contexts/history-context';
import './index.css';

createRoot(document.querySelector('#root')!).render(
  <StrictMode>
    <SidebarProvider>
      <SplitViewProvider>
        <InputProvider>
          <HistoryProvider>
            <App />
          </HistoryProvider>
        </InputProvider>
      </SplitViewProvider>
    </SidebarProvider>
  </StrictMode>,
);

if ('serviceWorker' in navigator) {
  // eslint-disable-next-line unicorn/prefer-top-level-await
  navigator.serviceWorker.ready.then((registration) => {
    registration.unregister();
  });
}
