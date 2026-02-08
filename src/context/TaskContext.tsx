import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, QuadrantType } from '../types/task.ts';
import { saveTasks, loadTasks } from '../utils/storage';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
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

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider = ({ children }: TaskProviderProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const loadedTasks = loadTasks();
    setTasks(loadedTasks);
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (tasks.length > 0 || localStorage.getItem('eisenhower-tasks')) {
      saveTasks(tasks);
    }
  }, [tasks]);

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const getTasksByQuadrant = (quadrant: QuadrantType): Task[] => {
    return tasks.filter((task) => {
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
    });
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
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

