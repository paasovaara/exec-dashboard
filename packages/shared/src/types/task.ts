export type Urgency = boolean;
export type Importance = boolean;

export type TaskStatus = 'active' | 'done' | 'deleted';

export type Task = {
  id: string;
  title: string;
  urgency: Urgency;
  importance: Importance;
  status?: TaskStatus;
  details?: string;
  dueDate?: Date | null;
  metadata?: Record<string, unknown>;
  linkedInitiativeIds?: string[];
  linkedProgramIds?: string[];
};

export type QuadrantType =
  | 'urgent-important'
  | 'important-not-urgent'
  | 'urgent-not-important'
  | 'not-important-not-urgent';
