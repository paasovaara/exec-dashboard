import { useState, useEffect } from 'react';
import { ActivityEvent, ActivityType } from '../types/activity';
import { LocalStorageActivityRepository } from '../repositories/LocalStorageActivityRepository';

const activityRepo = new LocalStorageActivityRepository();

const typeLabel: Record<ActivityType, string> = {
  task_added: 'Added',
  task_done: 'Done',
  task_deleted: 'Deleted',
};

const typeEmoji: Record<ActivityType, string> = {
  task_added: '➕',
  task_done: '✅',
  task_deleted: '🗑️',
};

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) {
    return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString(undefined, { dateStyle: 'short' }) + ' ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

export const ActivityPage = () => {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    activityRepo.getEvents().then((list) => {
      setEvents([...list].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      setLoading(false);
    });
  }, []);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="max-w-2xl mx-auto px-4 pt-8 pb-4">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-200 to-indigo-200 bg-clip-text text-transparent mb-6">
            Activity
          </h1>
          {loading ? (
            <p className="text-purple-200/70">Loading...</p>
          ) : events.length === 0 ? (
            <div className="backdrop-blur-xl bg-purple-500/10 border border-purple-400/20 rounded-lg p-6">
              <p className="text-purple-200/60 text-center italic">No activity yet.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {events.map((event) => (
                <li
                  key={event.id}
                  className="backdrop-blur-md bg-white/10 border border-purple-300/30 rounded-lg px-4 py-3 flex flex-wrap items-center gap-2"
                >
                  <span className="text-lg" aria-hidden>{typeEmoji[event.type]}</span>
                  <span className="text-purple-200/80 text-sm font-medium tabular-nums">
                    {formatTimestamp(event.timestamp)}
                  </span>
                  <span className="text-white font-medium">{event.taskTitle}</span>
                  <span className="text-purple-300/80 text-sm">{typeLabel[event.type]}</span>
                  {event.metadata && Object.keys(event.metadata).length > 0 && event.type === 'task_added' && (() => {
                    const parts = [];
                    if (event.metadata.dueDate) parts.push(`Due ${new Date(event.metadata.dueDate as string).toLocaleDateString()}`);
                    if ((event.metadata.linkedInitiativeIds as string[] | undefined)?.length) parts.push('Linked to initiatives');
                    if ((event.metadata.linkedProgramIds as string[] | undefined)?.length) parts.push('Linked to programs');
                    return parts.length ? <span className="text-xs text-purple-200/60 w-full mt-1">{parts.join(' · ')}</span> : null;
                  })()}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
