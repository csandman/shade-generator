import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './fonts';
import App from 'Components/App';
import { InputProvider } from 'contexts/input-context';
import { SidebarProvider } from 'contexts/sidebar-context';
import { SplitViewProvider } from 'contexts/split-view-context';
import { HistoryProvider } from 'contexts/history-context';
import './index.css';

createRoot(document.getElementById('root')!).render(
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
