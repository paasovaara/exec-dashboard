import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { TaskProvider } from './context/TaskContext'
import { CriticalObjectivesProvider } from './context/CriticalObjectivesContext'

import { LocalStorageTaskRepository } from './repositories/LocalStorageTaskRepository'
import { LocalStorageActivityRepository } from './repositories/LocalStorageActivityRepository'
import { LocalStorageCriticalObjectivesRepository } from './repositories/LocalStorageCriticalObjectivesRepository'
import { SupabaseTaskRepository } from './repositories/SupabaseTaskRepository'
import { SupabaseActivityRepository } from './repositories/SupabaseActivityRepository'
import { SupabaseCriticalObjectivesRepository } from './repositories/SupabaseCriticalObjectivesRepository'

const useSupabase = import.meta.env.VITE_USE_SUPABASE === 'true'

const taskRepository = useSupabase
  ? new SupabaseTaskRepository()
  : new LocalStorageTaskRepository()

const activityRepository = useSupabase
  ? new SupabaseActivityRepository()
  : new LocalStorageActivityRepository()

const criticalObjectivesRepository = useSupabase
  ? new SupabaseCriticalObjectivesRepository()
  : new LocalStorageCriticalObjectivesRepository()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <TaskProvider repository={taskRepository} activityRepository={activityRepository}>
        <CriticalObjectivesProvider repository={criticalObjectivesRepository}>
          <App />
        </CriticalObjectivesProvider>
      </TaskProvider>
    </BrowserRouter>
  </StrictMode>,
)
