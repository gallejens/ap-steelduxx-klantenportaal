import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.tsx';
import { Providers } from './Providers.tsx';

// Base styles
import '@mantine/core/styles.css';
import './styles/main.scss';

// localisation
import './i18n.ts';

const rootElement = document.getElementById('root');

if (!rootElement) throw new Error('Root element not found');

const root = ReactDOM.createRoot(rootElement);

root.render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>
);
