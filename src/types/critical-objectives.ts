export type RagStatus = 'red' | 'amber' | 'green';

export type Priority = 'P0' | 'P1' | 'P2';

export type Person = {
  id: string;
  firstname: string;
  lastname: string;
  title?: string | null;
  avatar?: string | null;
};

export type Initiative = {
  id: string;
  ragStatus: RagStatus;
  title: string;
  priority: Priority;
  targetDate?: string | null;
  driId?: string | null;
  needsAttention: boolean;
};

export type Program = {
  id: string;
  ragStatus: RagStatus;
  title: string;
  priority: Priority;
  targetDate?: string | null;
  initiativeIds: string[];
};

