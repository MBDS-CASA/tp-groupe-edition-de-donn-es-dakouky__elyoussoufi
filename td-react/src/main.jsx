import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Depart from './depart.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Depart />
  </StrictMode>,
)
