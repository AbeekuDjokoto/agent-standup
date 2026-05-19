import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import { IconPreloader, Providers } from './components';

import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <IconPreloader />
    <Providers>
      <App />
    </Providers>
  </StrictMode>,
);
