import { ActivityEvent } from '../types/activity';
import { ActivityRepository } from './ActivityRepository';

const STORAGE_KEY = 'eisenhower-activity';

function loadFromStorage(): ActivityEvent[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load activity from localStorage:', error);
  }
  return [];
}

function saveToStorage(events: ActivityEvent[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (error) {
    console.error('Failed to save activity to localStorage:', error);
  }
}

export class LocalStorageActivityRepository implements ActivityRepository {
  async getEvents(): Promise<ActivityEvent[]> {
    return loadFromStorage();
  }

  async appendEvent(event: Omit<ActivityEvent, 'id'>): Promise<ActivityEvent> {
    const events = loadFromStorage();
    const newEvent: ActivityEvent = { ...event, id: crypto.randomUUID() };
    events.push(newEvent);
    saveToStorage(events);
    return newEvent;
  }
}
