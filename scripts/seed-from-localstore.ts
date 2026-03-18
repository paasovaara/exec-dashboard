import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { LocalStoreDumpSchema } from '@exec-dashboard/shared';

const SUPABASE_URL = process.env.SUPABASE_URL ?? 'http://127.0.0.1:54321';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

if (!SUPABASE_SERVICE_KEY) {
  console.error(
    'Missing SUPABASE_SERVICE_ROLE_KEY env var.\n' +
      'Get it from `supabase status` (service_role key) and export it:\n' +
      '  export SUPABASE_SERVICE_ROLE_KEY="<key>"',
  );
  process.exit(1);
}

const dumpPath = process.argv[2];
if (!dumpPath) {
  console.error('Usage: npx tsx scripts/seed-from-localstore.ts <path-to-dump.json>');
  process.exit(1);
}

const raw = JSON.parse(readFileSync(dumpPath, 'utf-8'));
const parsed = LocalStoreDumpSchema.safeParse(raw);

if (!parsed.success) {
  console.error('Invalid dump file:', parsed.error.format());
  process.exit(1);
}

const dump = parsed.data;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function upsertBatch(table: string, rows: Record<string, unknown>[]) {
  if (rows.length === 0) return;
  const { error } = await supabase.from(table).upsert(rows, { onConflict: 'id' });
  if (error) {
    console.error(`Failed to upsert into ${table}:`, error.message);
    process.exit(1);
  }
  console.log(`  ${table}: ${rows.length} rows upserted`);
}

async function main() {
  console.log(`Seeding from ${dumpPath}...`);

  await upsertBatch(
    'persons',
    dump.persons.map((p) => ({
      id: p.id,
      firstname: p.firstname,
      lastname: p.lastname,
      title: p.title ?? null,
      avatar: p.avatar ?? null,
    })),
  );

  await upsertBatch(
    'initiatives',
    dump.initiatives.map((i) => ({
      id: i.id,
      rag_status: i.ragStatus,
      title: i.title,
      priority: i.priority,
      target_date: i.targetDate ?? null,
      dri_id: i.driId ?? null,
      needs_attention: i.needsAttention,
    })),
  );

  await upsertBatch(
    'programs',
    dump.programs.map((p) => ({
      id: p.id,
      rag_status: p.ragStatus,
      title: p.title,
      priority: p.priority,
      target_date: p.targetDate ?? null,
      initiative_ids: p.initiativeIds,
    })),
  );

  await upsertBatch(
    'tasks',
    dump.tasks.map((t) => ({
      id: t.id,
      title: t.title,
      urgency: t.urgency,
      importance: t.importance,
      status: t.status ?? 'active',
      details: t.details ?? null,
      due_date: t.dueDate ?? null,
      metadata: t.metadata ?? null,
      linked_initiative_ids: t.linkedInitiativeIds ?? [],
      linked_program_ids: t.linkedProgramIds ?? [],
    })),
  );

  await upsertBatch(
    'activity_events',
    dump.activity.map((e) => ({
      id: e.id,
      type: e.type,
      task_id: e.taskId,
      task_title: e.taskTitle,
      timestamp: e.timestamp,
      metadata: e.metadata ?? null,
    })),
  );

  console.log('Seed complete.');
}

main();
