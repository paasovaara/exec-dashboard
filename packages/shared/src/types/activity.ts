export type ActivityType = 'task_added' | 'task_done' | 'task_deleted';

export type ActivityEvent = {
  id: string;
  type: ActivityType;
  taskId: string;
  taskTitle: string;
  timestamp: string; // ISO 8601
  metadata?: Record<string, unknown>;
};
