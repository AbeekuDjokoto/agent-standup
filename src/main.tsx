import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { IconPreloader, Providers } from './components';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <IconPreloader />
    <Providers>
      <App />
    </Providers>
  </StrictMode>,
)
