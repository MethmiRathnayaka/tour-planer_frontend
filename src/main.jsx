import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter, HashRouter} from 'react-router-dom'
import StoreContextProvider from './Context/store-context.jsx'
import AccContextProvider from './Context/acc-context.jsx'

createRoot(document.getElementById('root')).render(
  <HashRouter>
    <StoreContextProvider>
    <AccContextProvider>
      <App />
    </AccContextProvider>
    </StoreContextProvider>
  
  </HashRouter>
    
  
)
