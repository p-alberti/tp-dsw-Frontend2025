// src/main.tsx

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'   //  Esto ya lo tenías
import { AuthProvider } from './context/AuthContext.tsx'; //  1. Importamos nuestro AuthProvider
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>       
      <AuthProvider>      
        <App />             
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)