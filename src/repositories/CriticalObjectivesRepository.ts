import { Person, Initiative, Program } from '../types/critical-objectives';

export interface CriticalObjectivesRepository {
  // Person operations
  getAllPersons(): Promise<Person[]>;
  getPersonById(id: string): Promise<Person | null>;
  createPerson(person: Omit<Person, 'id'>): Promise<Person>;
  updatePerson(id: string, updates: Partial<Person>): Promise<Person>;
  deletePerson(id: string): Promise<void>;

  // Initiative operations
  getAllInitiatives(): Promise<Initiative[]>;
  getInitiativeById(id: string): Promise<Initiative | null>;
  createInitiative(initiative: Omit<Initiative, 'id'>): Promise<Initiative>;
  updateInitiative(id: string, updates: Partial<Initiative>): Promise<Initiative>;
  deleteInitiative(id: string): Promise<void>;

  // Program operations
  getAllPrograms(): Promise<Program[]>;
  getProgramById(id: string): Promise<Program | null>;
  createProgram(program: Omit<Program, 'id'>): Promise<Program>;
  updateProgram(id: string, updates: Partial<Program>): Promise<Program>;
  deleteProgram(id: string): Promise<void>;
}

