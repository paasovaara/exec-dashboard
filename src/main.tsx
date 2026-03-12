import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { TaskProvider } from './context/TaskContext'
import { CriticalObjectivesProvider } from './context/CriticalObjectivesContext'
import { LocalStorageActivityRepository } from './repositories/LocalStorageActivityRepository'

const activityRepository = new LocalStorageActivityRepository()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <TaskProvider activityRepository={activityRepository}>
        <CriticalObjectivesProvider>
          <App />
        </CriticalObjectivesProvider>
      </TaskProvider>
    </BrowserRouter>
  </StrictMode>,
)
