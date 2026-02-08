import { Person, Initiative, Program } from '../types/critical-objectives';
import { CriticalObjectivesRepository } from './CriticalObjectivesRepository';

const STORAGE_KEYS = {
  persons: 'critical-objectives-persons',
  initiatives: 'critical-objectives-initiatives',
  programs: 'critical-objectives-programs',
} as const;

function loadFromStorage<T>(key: string): T[] {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored) as T[];
    }
  } catch (error) {
    console.error(`Failed to load ${key} from localStorage:`, error);
  }
  return [];
}

function saveToStorage<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Failed to save ${key} to localStorage:`, error);
  }
}

export class LocalStorageCriticalObjectivesRepository implements CriticalObjectivesRepository {
  // --- Person operations ---

  async getAllPersons(): Promise<Person[]> {
    return loadFromStorage<Person>(STORAGE_KEYS.persons);
  }

  async getPersonById(id: string): Promise<Person | null> {
    const persons = loadFromStorage<Person>(STORAGE_KEYS.persons);
    return persons.find((p) => p.id === id) ?? null;
  }

  async createPerson(person: Omit<Person, 'id'>): Promise<Person> {
    const persons = loadFromStorage<Person>(STORAGE_KEYS.persons);
    const newPerson: Person = { ...person, id: crypto.randomUUID() };
    persons.push(newPerson);
    saveToStorage(STORAGE_KEYS.persons, persons);
    return newPerson;
  }

  async updatePerson(id: string, updates: Partial<Person>): Promise<Person> {
    const persons = loadFromStorage<Person>(STORAGE_KEYS.persons);
    const index = persons.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Person with id ${id} not found`);
    }
    const updated = { ...persons[index], ...updates, id };
    persons[index] = updated;
    saveToStorage(STORAGE_KEYS.persons, persons);
    return updated;
  }

  async deletePerson(id: string): Promise<void> {
    const persons = loadFromStorage<Person>(STORAGE_KEYS.persons);
    const filtered = persons.filter((p) => p.id !== id);
    saveToStorage(STORAGE_KEYS.persons, filtered);
  }

  // --- Initiative operations ---

  async getAllInitiatives(): Promise<Initiative[]> {
    return loadFromStorage<Initiative>(STORAGE_KEYS.initiatives);
  }

  async getInitiativeById(id: string): Promise<Initiative | null> {
    const initiatives = loadFromStorage<Initiative>(STORAGE_KEYS.initiatives);
    return initiatives.find((i) => i.id === id) ?? null;
  }

  async createInitiative(initiative: Omit<Initiative, 'id'>): Promise<Initiative> {
    const initiatives = loadFromStorage<Initiative>(STORAGE_KEYS.initiatives);
    const newInitiative: Initiative = { ...initiative, id: crypto.randomUUID() };
    initiatives.push(newInitiative);
    saveToStorage(STORAGE_KEYS.initiatives, initiatives);
    return newInitiative;
  }

  async updateInitiative(id: string, updates: Partial<Initiative>): Promise<Initiative> {
    const initiatives = loadFromStorage<Initiative>(STORAGE_KEYS.initiatives);
    const index = initiatives.findIndex((i) => i.id === id);
    if (index === -1) {
      throw new Error(`Initiative with id ${id} not found`);
    }
    const updated = { ...initiatives[index], ...updates, id };
    initiatives[index] = updated;
    saveToStorage(STORAGE_KEYS.initiatives, initiatives);
    return updated;
  }

  async deleteInitiative(id: string): Promise<void> {
    const initiatives = loadFromStorage<Initiative>(STORAGE_KEYS.initiatives);
    const filtered = initiatives.filter((i) => i.id !== id);
    saveToStorage(STORAGE_KEYS.initiatives, filtered);
  }

  // --- Program operations ---

  async getAllPrograms(): Promise<Program[]> {
    return loadFromStorage<Program>(STORAGE_KEYS.programs);
  }

  async getProgramById(id: string): Promise<Program | null> {
    const programs = loadFromStorage<Program>(STORAGE_KEYS.programs);
    return programs.find((p) => p.id === id) ?? null;
  }

  async createProgram(program: Omit<Program, 'id'>): Promise<Program> {
    const programs = loadFromStorage<Program>(STORAGE_KEYS.programs);
    const newProgram: Program = { ...program, id: crypto.randomUUID() };
    programs.push(newProgram);
    saveToStorage(STORAGE_KEYS.programs, programs);
    return newProgram;
  }

  async updateProgram(id: string, updates: Partial<Program>): Promise<Program> {
    const programs = loadFromStorage<Program>(STORAGE_KEYS.programs);
    const index = programs.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Program with id ${id} not found`);
    }
    const updated = { ...programs[index], ...updates, id };
    programs[index] = updated;
    saveToStorage(STORAGE_KEYS.programs, programs);
    return updated;
  }

  async deleteProgram(id: string): Promise<void> {
    const programs = loadFromStorage<Program>(STORAGE_KEYS.programs);
    const filtered = programs.filter((p) => p.id !== id);
    saveToStorage(STORAGE_KEYS.programs, filtered);
  }
}

