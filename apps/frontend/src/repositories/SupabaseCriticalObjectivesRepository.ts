import type { Person, Initiative, Program } from '@exec-dashboard/shared';
import type { CriticalObjectivesRepository } from './CriticalObjectivesRepository';
import { supabase } from '../lib/supabase';

// ── Row types (snake_case from Postgres) ───────────────────

interface PersonRow {
  id: string;
  firstname: string;
  lastname: string;
  title: string | null;
  avatar: string | null;
}

interface InitiativeRow {
  id: string;
  rag_status: string;
  title: string;
  priority: string;
  target_date: string | null;
  dri_id: string | null;
  needs_attention: boolean;
}

interface ProgramRow {
  id: string;
  rag_status: string;
  title: string;
  priority: string;
  target_date: string | null;
  initiative_ids: string[];
}

// ── Mappers ────────────────────────────────────────────────

function rowToPerson(r: PersonRow): Person {
  return {
    id: r.id,
    firstname: r.firstname,
    lastname: r.lastname,
    title: r.title,
    avatar: r.avatar,
  };
}

function rowToInitiative(r: InitiativeRow): Initiative {
  return {
    id: r.id,
    ragStatus: r.rag_status as Initiative['ragStatus'],
    title: r.title,
    priority: r.priority as Initiative['priority'],
    targetDate: r.target_date,
    driId: r.dri_id,
    needsAttention: r.needs_attention,
  };
}

function rowToProgram(r: ProgramRow): Program {
  return {
    id: r.id,
    ragStatus: r.rag_status as Program['ragStatus'],
    title: r.title,
    priority: r.priority as Program['priority'],
    targetDate: r.target_date,
    initiativeIds: r.initiative_ids ?? [],
  };
}

function personToRow(p: Partial<Person>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (p.firstname !== undefined) row.firstname = p.firstname;
  if (p.lastname !== undefined) row.lastname = p.lastname;
  if (p.title !== undefined) row.title = p.title;
  if (p.avatar !== undefined) row.avatar = p.avatar;
  return row;
}

function initiativeToRow(i: Partial<Initiative>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (i.ragStatus !== undefined) row.rag_status = i.ragStatus;
  if (i.title !== undefined) row.title = i.title;
  if (i.priority !== undefined) row.priority = i.priority;
  if (i.targetDate !== undefined) row.target_date = i.targetDate;
  if (i.driId !== undefined) row.dri_id = i.driId;
  if (i.needsAttention !== undefined) row.needs_attention = i.needsAttention;
  return row;
}

function programToRow(p: Partial<Program>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (p.ragStatus !== undefined) row.rag_status = p.ragStatus;
  if (p.title !== undefined) row.title = p.title;
  if (p.priority !== undefined) row.priority = p.priority;
  if (p.targetDate !== undefined) row.target_date = p.targetDate;
  if (p.initiativeIds !== undefined) row.initiative_ids = p.initiativeIds;
  return row;
}

// ── Repository ─────────────────────────────────────────────

export class SupabaseCriticalObjectivesRepository implements CriticalObjectivesRepository {
  // --- Person ---

  async getAllPersons(): Promise<Person[]> {
    const { data, error } = await supabase.from('persons').select('*');
    if (error) throw error;
    return (data as PersonRow[]).map(rowToPerson);
  }

  async getPersonById(id: string): Promise<Person | null> {
    const { data, error } = await supabase.from('persons').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data ? rowToPerson(data as PersonRow) : null;
  }

  async createPerson(person: Omit<Person, 'id'>): Promise<Person> {
    const row = personToRow(person);
    const { data, error } = await supabase.from('persons').insert(row).select().single();
    if (error) throw error;
    return rowToPerson(data as PersonRow);
  }

  async updatePerson(id: string, updates: Partial<Person>): Promise<Person> {
    const row = personToRow(updates);
    const { data, error } = await supabase
      .from('persons')
      .update(row)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return rowToPerson(data as PersonRow);
  }

  async deletePerson(id: string): Promise<void> {
    const { error } = await supabase.from('persons').delete().eq('id', id);
    if (error) throw error;
  }

  // --- Initiative ---

  async getAllInitiatives(): Promise<Initiative[]> {
    const { data, error } = await supabase.from('initiatives').select('*');
    if (error) throw error;
    return (data as InitiativeRow[]).map(rowToInitiative);
  }

  async getInitiativeById(id: string): Promise<Initiative | null> {
    const { data, error } = await supabase
      .from('initiatives')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data ? rowToInitiative(data as InitiativeRow) : null;
  }

  async createInitiative(initiative: Omit<Initiative, 'id'>): Promise<Initiative> {
    const row = initiativeToRow(initiative);
    const { data, error } = await supabase.from('initiatives').insert(row).select().single();
    if (error) throw error;
    return rowToInitiative(data as InitiativeRow);
  }

  async updateInitiative(id: string, updates: Partial<Initiative>): Promise<Initiative> {
    const row = initiativeToRow(updates);
    const { data, error } = await supabase
      .from('initiatives')
      .update(row)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return rowToInitiative(data as InitiativeRow);
  }

  async deleteInitiative(id: string): Promise<void> {
    const { error } = await supabase.from('initiatives').delete().eq('id', id);
    if (error) throw error;
  }

  // --- Program ---

  async getAllPrograms(): Promise<Program[]> {
    const { data, error } = await supabase.from('programs').select('*');
    if (error) throw error;
    return (data as ProgramRow[]).map(rowToProgram);
  }

  async getProgramById(id: string): Promise<Program | null> {
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data ? rowToProgram(data as ProgramRow) : null;
  }

  async createProgram(program: Omit<Program, 'id'>): Promise<Program> {
    const row = programToRow(program);
    const { data, error } = await supabase.from('programs').insert(row).select().single();
    if (error) throw error;
    return rowToProgram(data as ProgramRow);
  }

  async updateProgram(id: string, updates: Partial<Program>): Promise<Program> {
    const row = programToRow(updates);
    const { data, error } = await supabase
      .from('programs')
      .update(row)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return rowToProgram(data as ProgramRow);
  }

  async deleteProgram(id: string): Promise<void> {
    const { error } = await supabase.from('programs').delete().eq('id', id);
    if (error) throw error;
  }
}
