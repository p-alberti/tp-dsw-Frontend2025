import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'   // ✅ Importamos el router
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>   {/* ✅ Envolvemos la app con el Router */}
      <App />
    </BrowserRouter>
  </StrictMode>,
)
