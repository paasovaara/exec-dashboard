import type { Task } from '@exec-dashboard/shared';
import type { TaskRepository } from './TaskRepository';
import { supabase } from '../lib/supabase';

interface TaskRow {
  id: string;
  title: string;
  urgency: boolean;
  importance: boolean;
  status: string;
  details: string | null;
  due_date: string | null;
  metadata: Record<string, unknown> | null;
  linked_initiative_ids: string[] | null;
  linked_program_ids: string[] | null;
}

function rowToTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    urgency: row.urgency,
    importance: row.importance,
    status: (row.status as Task['status']) ?? 'active',
    details: row.details ?? undefined,
    dueDate: row.due_date ? new Date(row.due_date) : null,
    metadata: row.metadata ?? undefined,
    linkedInitiativeIds: row.linked_initiative_ids ?? undefined,
    linkedProgramIds: row.linked_program_ids ?? undefined,
  };
}

function taskToRow(task: Partial<Task>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (task.title !== undefined) row.title = task.title;
  if (task.urgency !== undefined) row.urgency = task.urgency;
  if (task.importance !== undefined) row.importance = task.importance;
  if (task.status !== undefined) row.status = task.status;
  if (task.details !== undefined) row.details = task.details;
  if (task.dueDate !== undefined)
    row.due_date = task.dueDate instanceof Date ? task.dueDate.toISOString() : task.dueDate;
  if (task.metadata !== undefined) row.metadata = task.metadata;
  if (task.linkedInitiativeIds !== undefined) row.linked_initiative_ids = task.linkedInitiativeIds;
  if (task.linkedProgramIds !== undefined) row.linked_program_ids = task.linkedProgramIds;
  return row;
}

export class SupabaseTaskRepository implements TaskRepository {
  async getAllTasks(): Promise<Task[]> {
    const { data, error } = await supabase.from('tasks').select('*');
    if (error) throw error;
    return (data as TaskRow[]).map(rowToTask);
  }

  async getTaskById(id: string): Promise<Task | null> {
    const { data, error } = await supabase.from('tasks').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data ? rowToTask(data as TaskRow) : null;
  }

  async createTask(task: Omit<Task, 'id'>): Promise<Task> {
    const row = taskToRow(task);
    const { data, error } = await supabase.from('tasks').insert(row).select().single();
    if (error) throw error;
    return rowToTask(data as TaskRow);
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const row = taskToRow(updates);
    const { data, error } = await supabase
      .from('tasks')
      .update(row)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return rowToTask(data as TaskRow);
  }

  async deleteTask(id: string): Promise<void> {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) throw error;
  }
}
