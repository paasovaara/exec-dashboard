import { z } from 'zod';

export const TaskStatusSchema = z.enum(['active', 'done', 'deleted']);

export const TaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  urgency: z.boolean(),
  importance: z.boolean(),
  status: TaskStatusSchema.optional(),
  details: z.string().optional(),
  dueDate: z.coerce.date().nullable().optional(),
  metadata: z.record(z.unknown()).optional(),
  linkedInitiativeIds: z.array(z.string().uuid()).optional(),
  linkedProgramIds: z.array(z.string().uuid()).optional(),
});

export const TaskInsertSchema = TaskSchema.omit({ id: true });

export type TaskRow = z.infer<typeof TaskSchema>;
