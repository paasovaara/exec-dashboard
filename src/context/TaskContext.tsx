import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { Task, QuadrantType } from '../types/task.ts';
import { TaskRepository } from '../repositories/TaskRepository';
import { LocalStorageTaskRepository } from '../repositories/LocalStorageTaskRepository';
import { ActivityRepository } from '../repositories/ActivityRepository';

interface TaskContextType {
  tasks: Task[];
  activeTasks: Task[];
  loading: boolean;
  error: string | null;
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  markTaskDone: (id: string) => Promise<void>;
  getTasksByQuadrant: (quadrant: QuadrantType) => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

const defaultRepository = new LocalStorageTaskRepository();

interface TaskProviderProps {
  children: ReactNode;
  repository?: TaskRepository;
  activityRepository?: ActivityRepository | null;
}

export const TaskProvider = ({
  children,
  repository = defaultRepository,
  activityRepository = null,
}: TaskProviderProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const activeTasks = useMemo(
    () => tasks.filter((t) => t.status !== 'done'),
    [tasks]
  );

  // Load tasks from repository on mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        setError(null);
        const loadedTasks = await repository.getAllTasks();
        setTasks(loadedTasks);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tasks');
        console.error('Failed to load tasks:', err);
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, [repository]);

  const addTask = useCallback(async (task: Omit<Task, 'id'>) => {
    try {
      const created = await repository.createTask(task);
      setTasks((prev) => [...prev, created]);
      if (activityRepository) {
        await activityRepository.appendEvent({
          type: 'task_added',
          taskId: created.id,
          taskTitle: created.title,
          timestamp: new Date().toISOString(),
          metadata: {
            urgency: created.urgency,
            importance: created.importance,
            dueDate: created.dueDate?.toISOString(),
            linkedInitiativeIds: created.linkedInitiativeIds,
            linkedProgramIds: created.linkedProgramIds,
          },
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
      throw err;
    }
  }, [repository, activityRepository]);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    try {
      const updated = await repository.updateTask(id, updates);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      throw err;
    }
  }, [repository]);

  const deleteTask = useCallback(async (id: string) => {
    try {
      const task = tasks.find((t) => t.id === id);
      if (activityRepository && task) {
        await activityRepository.appendEvent({
          type: 'task_deleted',
          taskId: task.id,
          taskTitle: task.title,
          timestamp: new Date().toISOString(),
        });
      }
      await repository.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      throw err;
    }
  }, [repository, activityRepository, tasks]);

  const markTaskDone = useCallback(async (id: string) => {
    try {
      const task = tasks.find((t) => t.id === id);
      const updated = await repository.updateTask(id, { status: 'done' });
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      if (activityRepository && task) {
        await activityRepository.appendEvent({
          type: 'task_done',
          taskId: task.id,
          taskTitle: task.title,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark task done');
      throw err;
    }
  }, [repository, activityRepository, tasks]);

  const getTasksByQuadrant = useCallback(
    (quadrant: QuadrantType): Task[] => {
      return activeTasks
        .filter((task) => {
          switch (quadrant) {
            case 'urgent-important':
              return task.urgency && task.importance;
            case 'important-not-urgent':
              return !task.urgency && task.importance;
            case 'urgent-not-important':
              return task.urgency && !task.importance;
            case 'not-important-not-urgent':
              return !task.urgency && !task.importance;
            default:
              return false;
          }
        })
        .sort((a, b) => {
          // 1. By due date — closer to today first, no due date last
          const aDate = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          const bDate = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
          if (aDate !== bDate) return aDate - bDate;
          // 2. Alphabetical by title
          return a.title.localeCompare(b.title);
        });
    },
    [activeTasks]
  );

  return (
    <TaskContext.Provider
      value={{
        tasks,
        activeTasks,
        loading,
        error,
        addTask,
        updateTask,
        deleteTask,
        markTaskDone,
        getTasksByQuadrant,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
