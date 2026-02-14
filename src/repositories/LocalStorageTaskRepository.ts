import { Task } from '../types/task';
import { TaskRepository } from './TaskRepository';

const STORAGE_KEY = 'eisenhower-tasks';

/** Shape of a Task as stored in JSON (dates as ISO strings). */
type SerializedTask = Omit<Task, 'dueDate'> & {
  dueDate?: string | null;
};

function deserializeTask(raw: SerializedTask): Task {
  return {
    ...raw,
    dueDate: raw.dueDate ? new Date(raw.dueDate) : raw.dueDate as null | undefined,
  };
}

function serializeTask(task: Task): SerializedTask {
  return {
    ...task,
    dueDate: task.dueDate instanceof Date ? task.dueDate.toISOString() : task.dueDate,
  };
}

function loadFromStorage(): Task[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const raw: SerializedTask[] = JSON.parse(stored);
      return raw.map(deserializeTask);
    }
  } catch (error) {
    console.error('Failed to load tasks from localStorage:', error);
  }
  return [];
}

function saveToStorage(tasks: Task[]): void {
  try {
    const serialized = tasks.map(serializeTask);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
  } catch (error) {
    console.error('Failed to save tasks to localStorage:', error);
  }
}

export class LocalStorageTaskRepository implements TaskRepository {
  async getAllTasks(): Promise<Task[]> {
    return loadFromStorage();
  }

  async getTaskById(id: string): Promise<Task | null> {
    const tasks = loadFromStorage();
    return tasks.find((t) => t.id === id) ?? null;
  }

  async createTask(task: Omit<Task, 'id'>): Promise<Task> {
    const tasks = loadFromStorage();
    const newTask: Task = { ...task, id: crypto.randomUUID() };
    tasks.push(newTask);
    saveToStorage(tasks);
    return newTask;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const tasks = loadFromStorage();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error(`Task with id ${id} not found`);
    }
    const updated = { ...tasks[index], ...updates, id };
    tasks[index] = updated;
    saveToStorage(tasks);
    return updated;
  }

  async deleteTask(id: string): Promise<void> {
    const tasks = loadFromStorage();
    const filtered = tasks.filter((t) => t.id !== id);
    saveToStorage(filtered);
  }
}
