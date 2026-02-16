import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Task, QuadrantType } from '../types/task.ts';
import { TaskRepository } from '../repositories/TaskRepository';
import { LocalStorageTaskRepository } from '../repositories/LocalStorageTaskRepository';

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
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
}

export const TaskProvider = ({
  children,
  repository = defaultRepository,
}: TaskProviderProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
      throw err;
    }
  }, [repository]);

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
      await repository.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      throw err;
    }
  }, [repository]);

  const getTasksByQuadrant = useCallback(
    (quadrant: QuadrantType): Task[] => {
      return tasks
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
    [tasks]
  );

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        addTask,
        updateTask,
        deleteTask,
        getTasksByQuadrant,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
