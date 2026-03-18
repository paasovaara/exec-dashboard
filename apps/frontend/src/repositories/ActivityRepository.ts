import type { ActivityEvent } from '@exec-dashboard/shared';

export interface ActivityRepository {
  getEvents(): Promise<ActivityEvent[]>;
  appendEvent(event: Omit<ActivityEvent, 'id'>): Promise<ActivityEvent>;
}
