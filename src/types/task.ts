export type Urgency = boolean; // true = urgent, false = not urgent
export type Importance = boolean; // true = important, false = not important

export type Task = {
  id: string;
  title: string;
  urgency: Urgency;
  importance: Importance;
  details?: string;
  metadata?: Record<string, unknown>;
};

export type QuadrantType = 
  | 'urgent-important'
  | 'important-not-urgent'
  | 'urgent-not-important'
  | 'not-important-not-urgent';

