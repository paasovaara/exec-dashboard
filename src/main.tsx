import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { TaskProvider } from './context/TaskContext.tsx'
import { CriticalObjectivesProvider } from './context/CriticalObjectivesContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <TaskProvider>
        <CriticalObjectivesProvider>
          <App />
        </CriticalObjectivesProvider>
      </TaskProvider>
    </BrowserRouter>
  </StrictMode>,
)
