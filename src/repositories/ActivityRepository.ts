import { ActivityEvent } from '../types/activity';

export interface ActivityRepository {
  getEvents(): Promise<ActivityEvent[]>;
  appendEvent(event: Omit<ActivityEvent, 'id'>): Promise<ActivityEvent>;
}
