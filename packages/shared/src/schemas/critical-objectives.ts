import { z } from 'zod';

export const RagStatusSchema = z.enum(['red', 'amber', 'green']);
export const PrioritySchema = z.enum(['P0', 'P1', 'P2']);

export const PersonSchema = z.object({
  id: z.string().uuid(),
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  title: z.string().nullable().optional(),
  avatar: z.string().nullable().optional(),
});

export const PersonInsertSchema = PersonSchema.omit({ id: true });

export const InitiativeSchema = z.object({
  id: z.string().uuid(),
  ragStatus: RagStatusSchema,
  title: z.string().min(1),
  priority: PrioritySchema,
  targetDate: z.string().nullable().optional(),
  driId: z.string().uuid().nullable().optional(),
  needsAttention: z.boolean(),
});

export const InitiativeInsertSchema = InitiativeSchema.omit({ id: true });

export const ProgramSchema = z.object({
  id: z.string().uuid(),
  ragStatus: RagStatusSchema,
  title: z.string().min(1),
  priority: PrioritySchema,
  targetDate: z.string().nullable().optional(),
  initiativeIds: z.array(z.string().uuid()),
});

export const ProgramInsertSchema = ProgramSchema.omit({ id: true });
