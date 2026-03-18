import type { ActivityEvent } from '@exec-dashboard/shared';
import type { ActivityRepository } from './ActivityRepository';
import { supabase } from '../lib/supabase';

interface ActivityRow {
  id: string;
  type: string;
  task_id: string;
  task_title: string;
  timestamp: string;
  metadata: Record<string, unknown> | null;
}

function rowToEvent(row: ActivityRow): ActivityEvent {
  return {
    id: row.id,
    type: row.type as ActivityEvent['type'],
    taskId: row.task_id,
    taskTitle: row.task_title,
    timestamp: row.timestamp,
    metadata: row.metadata ?? undefined,
  };
}

export class SupabaseActivityRepository implements ActivityRepository {
  async getEvents(): Promise<ActivityEvent[]> {
    const { data, error } = await supabase
      .from('activity_events')
      .select('*')
      .order('timestamp', { ascending: false });
    if (error) throw error;
    return (data as ActivityRow[]).map(rowToEvent);
  }

  async appendEvent(event: Omit<ActivityEvent, 'id'>): Promise<ActivityEvent> {
    const row = {
      type: event.type,
      task_id: event.taskId,
      task_title: event.taskTitle,
      timestamp: event.timestamp,
      metadata: event.metadata ?? null,
    };
    const { data, error } = await supabase
      .from('activity_events')
      .insert(row)
      .select()
      .single();
    if (error) throw error;
    return rowToEvent(data as ActivityRow);
  }
}
