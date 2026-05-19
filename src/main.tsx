import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ANCApp from './anc/ANCApp.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ANCApp />
  </StrictMode>,
)
