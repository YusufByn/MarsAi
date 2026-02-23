import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App.jsx'
import { initFingerprint } from './services/fingerprint.service'

// Lance la génération du fingerprint dès le démarrage (cache en sessionStorage)
initFingerprint();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
