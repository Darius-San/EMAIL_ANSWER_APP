import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from './modules/App';
import { ErrorBoundary } from './modules/layout/ErrorBoundary';
import { GlobalErrorOverlay } from './modules/layout/GlobalErrorOverlay';
import { BrowserRouter } from 'react-router-dom';
import './styles.css';

const queryClient = new QueryClient();

const rootEl = document.getElementById('root');
if(!rootEl){
  console.error('Root Element #root nicht gefunden – HTML defekt?');
}
console.info('[BOOT] Starting Email Responder App');
ReactDOM.createRoot(rootEl as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ErrorBoundary>
          <App />
          <GlobalErrorOverlay />
        </ErrorBoundary>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
