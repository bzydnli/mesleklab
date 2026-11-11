import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

// Önceden paylaşılan #/ bağlantılarını temiz adreslere taşı.
if (window.location.hash.startsWith('#/')) {
  const legacyPath = window.location.hash.slice(1)
  window.history.replaceState(null, '', `/mesleklab${legacyPath}`)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
