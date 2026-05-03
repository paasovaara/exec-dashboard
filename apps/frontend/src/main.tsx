import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { TaskProvider } from './context/TaskContext'
import { CriticalObjectivesProvider } from './context/CriticalObjectivesContext'
import { ActivityRepositoryProvider } from './context/ActivityRepositoryContext'
import { SupabaseConfigError } from './components/SupabaseConfigError'
import {
  isSupabaseMisconfigured,
  useSupabasePersistence,
} from './lib/persistenceConfig'

import { LocalStorageTaskRepository } from './repositories/LocalStorageTaskRepository'
import { LocalStorageActivityRepository } from './repositories/LocalStorageActivityRepository'
import { LocalStorageCriticalObjectivesRepository } from './repositories/LocalStorageCriticalObjectivesRepository'
import { SupabaseTaskRepository } from './repositories/SupabaseTaskRepository'
import { SupabaseActivityRepository } from './repositories/SupabaseActivityRepository'
import { SupabaseCriticalObjectivesRepository } from './repositories/SupabaseCriticalObjectivesRepository'

const taskRepository = useSupabasePersistence
  ? new SupabaseTaskRepository()
  : new LocalStorageTaskRepository()

const activityRepository = useSupabasePersistence
  ? new SupabaseActivityRepository()
  : new LocalStorageActivityRepository()

const criticalObjectivesRepository = useSupabasePersistence
  ? new SupabaseCriticalObjectivesRepository()
  : new LocalStorageCriticalObjectivesRepository()

console.info(
  '[exec-dashboard] Persistence:',
  useSupabasePersistence
    ? 'Supabase'
    : `browser (VITE_USE_SUPABASE was empty/false at build time: ${JSON.stringify(import.meta.env.VITE_USE_SUPABASE)})`,
)

const root = document.getElementById('root')!

if (isSupabaseMisconfigured) {
  createRoot(root).render(
    <StrictMode>
      <SupabaseConfigError />
    </StrictMode>,
  )
} else {
  createRoot(root).render(
    <StrictMode>
      <BrowserRouter>
        <ActivityRepositoryProvider repository={activityRepository}>
          <TaskProvider repository={taskRepository} activityRepository={activityRepository}>
            <CriticalObjectivesProvider repository={criticalObjectivesRepository}>
              <App />
            </CriticalObjectivesProvider>
          </TaskProvider>
        </ActivityRepositoryProvider>
      </BrowserRouter>
    </StrictMode>,
  )
}
