import { z } from 'zod';

export const ActivityTypeSchema = z.enum(['task_added', 'task_done', 'task_deleted']);

export const ActivityEventSchema = z.object({
  id: z.string().uuid(),
  type: ActivityTypeSchema,
  taskId: z.string().uuid(),
  taskTitle: z.string(),
  timestamp: z.string().datetime(),
  metadata: z.record(z.unknown()).optional(),
});

export const ActivityEventInsertSchema = ActivityEventSchema.omit({ id: true });

export type ActivityEventRow = z.infer<typeof ActivityEventSchema>;
