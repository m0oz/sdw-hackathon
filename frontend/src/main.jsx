import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App.jsx'

// Hintergrundbild base-path-bewusst setzen (CSS kennt import.meta.env nicht) –
// damit das Hero-SVG auch unter /sdw-hackathon/ (GitHub Pages) lädt.
document.documentElement.style.setProperty(
  '--hero-bg', `url(${import.meta.env.BASE_URL}hamburg-hero.svg)`
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
