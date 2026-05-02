import { createContext, useContext, type ReactNode } from 'react';
import type { ActivityRepository } from '../repositories/ActivityRepository';

const ActivityRepositoryContext = createContext<ActivityRepository | null>(null);

export function ActivityRepositoryProvider({
  repository,
  children,
}: {
  repository: ActivityRepository;
  children: ReactNode;
}) {
  return (
    <ActivityRepositoryContext.Provider value={repository}>
      {children}
    </ActivityRepositoryContext.Provider>
  );
}

/** Same pattern as other app contexts; hook co-located with provider. */
// eslint-disable-next-line react-refresh/only-export-components -- hook + provider pair
export function useActivityRepository(): ActivityRepository {
  const ctx = useContext(ActivityRepositoryContext);
  if (!ctx) {
    throw new Error('useActivityRepository must be used within ActivityRepositoryProvider');
  }
  return ctx;
}
