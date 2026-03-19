import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

try {
  const savedTheme = localStorage.getItem('theme') || 'light'
  const isDark = savedTheme === 'dark'
  document.documentElement.classList.toggle('dark', isDark)
  document.documentElement.setAttribute('data-theme', savedTheme)
} catch {
  document.documentElement.classList.remove('dark')
  document.documentElement.setAttribute('data-theme', 'light')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
