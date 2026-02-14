import { Task } from '../types/task';

export interface TaskRepository {
  getAllTasks(): Promise<Task[]>;
  getTaskById(id: string): Promise<Task | null>;
  createTask(task: Omit<Task, 'id'>): Promise<Task>;
  updateTask(id: string, updates: Partial<Task>): Promise<Task>;
  deleteTask(id: string): Promise<void>;
}

