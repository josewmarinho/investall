import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SimuladorCredito from './components/SimuladorCredito'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <SimuladorCredito />
  </StrictMode>,
)
