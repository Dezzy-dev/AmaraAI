import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import * as Sentry from "@sentry/react";
import { UserProvider } from './contexts/UserContext';

Sentry.init({
  dsn: "https://f460fb6d3310986a4d87cc4f21106982@o4509533063086080.ingest.us.sentry.io/4509533110272000",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      // Additional Replay configuration goes in here, for example:
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, 
  // Session Replay
  replaysSessionSampleRate: 0.1, 
  replaysOnErrorSampleRate: 1.0,
  // Send Default PII
  sendDefaultPii: true,
});

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <UserProvider>
        <Sentry.ErrorBoundary fallback={({ error, componentStack }) => (
          <div style={{ padding: 32 }}>
            <h2>Something went wrong</h2>
            <pre style={{ color: 'red' }}>{error?.toString()}</pre>
            <details style={{ whiteSpace: 'pre-wrap' }}>
              {componentStack}
            </details>
          </div>
        )}>
          <App />
        </Sentry.ErrorBoundary>
      </UserProvider>
    </StrictMode>
  );
}
