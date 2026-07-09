import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AudioProvider } from './context/AudioContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* AudioProvider wraps the entire app so any component can trigger music */}
    <AudioProvider>
      <App />
    </AudioProvider>
  </StrictMode>,
)

