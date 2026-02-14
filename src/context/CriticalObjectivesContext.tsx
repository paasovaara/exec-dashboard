import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Person, Initiative, Program } from '../types/critical-objectives';
import { CriticalObjectivesRepository } from '../repositories/CriticalObjectivesRepository';
import { LocalStorageCriticalObjectivesRepository } from '../repositories/LocalStorageCriticalObjectivesRepository';

interface CriticalObjectivesContextType {
  // State
  persons: Person[];
  initiatives: Initiative[];
  programs: Program[];
  loading: boolean;
  error: string | null;

  // Person CRUD
  addPerson: (person: Omit<Person, 'id'>) => Promise<void>;
  updatePerson: (id: string, updates: Partial<Person>) => Promise<void>;
  deletePerson: (id: string) => Promise<void>;

  // Initiative CRUD
  addInitiative: (initiative: Omit<Initiative, 'id'>) => Promise<string>;
  updateInitiative: (id: string, updates: Partial<Initiative>) => Promise<void>;
  deleteInitiative: (id: string) => Promise<void>;

  // Program CRUD
  addProgram: (program: Omit<Program, 'id'>) => Promise<void>;
  updateProgram: (id: string, updates: Partial<Program>) => Promise<void>;
  deleteProgram: (id: string) => Promise<void>;

  // Helper methods (sync, from state)
  getPersonById: (id: string) => Person | undefined;
  getInitiativeById: (id: string) => Initiative | undefined;
  getProgramById: (id: string) => Program | undefined;
  getInitiativesByProgramId: (programId: string) => Initiative[];
  getPersonByInitiativeId: (initiativeId: string) => Person | undefined;
}

const CriticalObjectivesContext = createContext<CriticalObjectivesContextType | undefined>(undefined);

export const useCriticalObjectives = () => {
  const context = useContext(CriticalObjectivesContext);
  if (!context) {
    throw new Error('useCriticalObjectives must be used within a CriticalObjectivesProvider');
  }
  return context;
};

const defaultRepository = new LocalStorageCriticalObjectivesRepository();

interface CriticalObjectivesProviderProps {
  children: ReactNode;
  repository?: CriticalObjectivesRepository;
}

export const CriticalObjectivesProvider = ({
  children,
  repository = defaultRepository,
}: CriticalObjectivesProviderProps) => {
  const [persons, setPersons] = useState<Person[]>([]);
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all data from repository on mount
  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true);
        setError(null);
        const [loadedPersons, loadedInitiatives, loadedPrograms] = await Promise.all([
          repository.getAllPersons(),
          repository.getAllInitiatives(),
          repository.getAllPrograms(),
        ]);
        setPersons(loadedPersons);
        setInitiatives(loadedInitiatives);
        setPrograms(loadedPrograms);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        console.error('Failed to load critical objectives data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, [repository]);

  // --- Person CRUD ---

  const addPerson = useCallback(async (person: Omit<Person, 'id'>) => {
    try {
      const created = await repository.createPerson(person);
      setPersons((prev) => [...prev, created]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create person');
      throw err;
    }
  }, [repository]);

  const updatePersonFn = useCallback(async (id: string, updates: Partial<Person>) => {
    try {
      const updated = await repository.updatePerson(id, updates);
      setPersons((prev) => prev.map((p) => (p.id === id ? updated : p)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update person');
      throw err;
    }
  }, [repository]);

  const deletePersonFn = useCallback(async (id: string) => {
    try {
      await repository.deletePerson(id);
      setPersons((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete person');
      throw err;
    }
  }, [repository]);

  // --- Initiative CRUD ---

  const addInitiative = useCallback(async (initiative: Omit<Initiative, 'id'>): Promise<string> => {
    try {
      const created = await repository.createInitiative(initiative);
      setInitiatives((prev) => [...prev, created]);
      return created.id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create initiative');
      throw err;
    }
  }, [repository]);

  const updateInitiativeFn = useCallback(async (id: string, updates: Partial<Initiative>) => {
    try {
      const updated = await repository.updateInitiative(id, updates);
      setInitiatives((prev) => prev.map((i) => (i.id === id ? updated : i)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update initiative');
      throw err;
    }
  }, [repository]);

  const deleteInitiativeFn = useCallback(async (id: string) => {
    try {
      await repository.deleteInitiative(id);
      setInitiatives((prev) => prev.filter((i) => i.id !== id));

      // Unlink initiative from all programs that reference it
      setPrograms((prev) => {
        const updated = prev.map((p) => {
          if (p.initiativeIds.includes(id)) {
            const newIds = p.initiativeIds.filter((iid) => iid !== id);
            // Persist the updated program
            repository.updateProgram(p.id, { initiativeIds: newIds });
            return { ...p, initiativeIds: newIds };
          }
          return p;
        });
        return updated;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete initiative');
      throw err;
    }
  }, [repository]);

  // --- Program CRUD ---

  const addProgram = useCallback(async (program: Omit<Program, 'id'>) => {
    try {
      const created = await repository.createProgram(program);
      setPrograms((prev) => [...prev, created]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create program');
      throw err;
    }
  }, [repository]);

  const updateProgramFn = useCallback(async (id: string, updates: Partial<Program>) => {
    try {
      const updated = await repository.updateProgram(id, updates);
      setPrograms((prev) => prev.map((p) => (p.id === id ? updated : p)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update program');
      throw err;
    }
  }, [repository]);

  const deleteProgramFn = useCallback(async (id: string) => {
    try {
      await repository.deleteProgram(id);
      setPrograms((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete program');
      throw err;
    }
  }, [repository]);

  // --- Helper methods (sync, from state) ---

  const getPersonById = useCallback(
    (id: string) => persons.find((p) => p.id === id),
    [persons]
  );

  const getInitiativeById = useCallback(
    (id: string) => initiatives.find((i) => i.id === id),
    [initiatives]
  );

  const getProgramById = useCallback(
    (id: string) => programs.find((p) => p.id === id),
    [programs]
  );

  const getInitiativesByProgramId = useCallback(
    (programId: string) => {
      const program = programs.find((p) => p.id === programId);
      if (!program) return [];
      return initiatives.filter((i) => program.initiativeIds.includes(i.id));
    },
    [programs, initiatives]
  );

  const getPersonByInitiativeId = useCallback(
    (initiativeId: string) => {
      const initiative = initiatives.find((i) => i.id === initiativeId);
      if (!initiative?.driId) return undefined;
      return persons.find((p) => p.id === initiative.driId);
    },
    [initiatives, persons]
  );

  return (
    <CriticalObjectivesContext.Provider
      value={{
        persons,
        initiatives,
        programs,
        loading,
        error,
        addPerson,
        updatePerson: updatePersonFn,
        deletePerson: deletePersonFn,
        addInitiative,
        updateInitiative: updateInitiativeFn,
        deleteInitiative: deleteInitiativeFn,
        addProgram,
        updateProgram: updateProgramFn,
        deleteProgram: deleteProgramFn,
        getPersonById,
        getInitiativeById,
        getProgramById,
        getInitiativesByProgramId,
        getPersonByInitiativeId,
      }}
    >
      {children}
    </CriticalObjectivesContext.Provider>
  );
};

