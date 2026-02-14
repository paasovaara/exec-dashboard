import { Task } from '../types/task';
import { TaskRepository } from './TaskRepository';

const STORAGE_KEY = 'eisenhower-tasks';

function loadFromStorage(): Task[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as Task[];
    }
  } catch (error) {
    console.error('Failed to load tasks from localStorage:', error);
  }
  return [];
}

function saveToStorage(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
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

