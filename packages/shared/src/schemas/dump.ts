import { z } from 'zod';
import { TaskSchema } from './task';
import { ActivityEventSchema } from './activity';
import { PersonSchema, InitiativeSchema, ProgramSchema } from './critical-objectives';

const DumpTaskSchema = TaskSchema.extend({
  dueDate: z.string().nullable().optional(),
});

export const LocalStoreDumpSchema = z.object({
  tasks: z.array(DumpTaskSchema),
  activity: z.array(ActivityEventSchema),
  persons: z.array(PersonSchema),
  initiatives: z.array(InitiativeSchema),
  programs: z.array(ProgramSchema),
});

export type LocalStoreDump = z.infer<typeof LocalStoreDumpSchema>;
