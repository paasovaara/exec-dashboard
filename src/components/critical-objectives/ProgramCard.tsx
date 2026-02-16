import { Program, Initiative, RagStatus } from '../../types/critical-objectives';
import { useCriticalObjectives } from '../../context/CriticalObjectivesContext';
import { useTasks } from '../../context/TaskContext';
import { Task } from '../../types/task';

interface ProgramCardProps {
  program: Program;
  onEditProgram: (program: Program) => void;
  onEditInitiative: (initiative: Initiative) => void;
}

const ragStyles: Record<RagStatus, { bg: string; border: string; text: string; badge: string; badgeText: string; initBg: string; initBorder: string; initHoverBg: string }> = {
  red: {
    bg: 'bg-red-500/35',
    border: 'border-red-400/40',
    text: 'text-red-200/90',
    badge: 'bg-red-500/30 border-red-400/50',
    badgeText: 'text-red-200',
    initBg: 'bg-red-500/35',
    initBorder: 'border-red-400/40',
    initHoverBg: 'hover:bg-red-500/50',
  },
  amber: {
    bg: 'bg-amber-500/20',
    border: 'border-amber-400/30',
    text: 'text-amber-200/90',
    badge: 'bg-amber-500/30 border-amber-400/50',
    badgeText: 'text-amber-200',
    initBg: 'bg-amber-500/35',
    initBorder: 'border-amber-400/40',
    initHoverBg: 'hover:bg-amber-500/50',
  },
  green: {
    bg: 'bg-emerald-500/20',
    border: 'border-emerald-400/30',
    text: 'text-emerald-200/90',
    badge: 'bg-emerald-500/30 border-emerald-400/50',
    badgeText: 'text-emerald-200',
    initBg: 'bg-emerald-500/35',
    initBorder: 'border-emerald-400/40',
    initHoverBg: 'hover:bg-emerald-500/50',
  },
};

const ragEmoji: Record<RagStatus, string> = {
  red: '🔴',
  amber: '🟡',
  green: '🟢',
};

const priorityLabel: Record<string, string> = {
  P0: 'P0 — Critical',
  P1: 'P1 — High',
  P2: 'P2 — Normal',
};

function getTaskEmoji(task: Task): string | null {
  if (task.urgency && task.importance) return '🫵';
  if (task.importance && !task.urgency) return '⏳';
  if (task.urgency && !task.importance) return '🤝';
  return null; // not important & not urgent — no emoji
}

const LinkedTaskEmojis = ({ tasks }: { tasks: Task[] }) => {
  // Only show tasks that have an emoji (i.e. exclude not-important & not-urgent)
  const visibleTasks = tasks
    .map((t) => ({ task: t, emoji: getTaskEmoji(t) }))
    .filter((x): x is { task: Task; emoji: string } => x.emoji !== null);

  if (visibleTasks.length === 0) return null;

  return (
    <span className="relative group inline-flex gap-0.5 cursor-default" onClick={(e) => e.stopPropagation()}>
      {visibleTasks.map(({ task, emoji }) => (
        <span key={task.id} className="text-sm">{emoji}</span>
      ))}
      {/* Hover tooltip */}
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex flex-col gap-1 px-3 py-2 rounded-lg backdrop-blur-xl bg-gray-900/95 border border-purple-400/30 shadow-xl text-xs text-white whitespace-nowrap z-50 min-w-max">
        <span className="font-semibold text-purple-200/90 mb-0.5">Linked Tasks</span>
        {tasks.map((t) => {
          const emoji = getTaskEmoji(t);
          return (
            <span key={t.id} className="text-purple-100/90">
              {emoji ? `${emoji} ` : ''}{t.title}
            </span>
          );
        })}
      </span>
    </span>
  );
};

export const ProgramCard = ({ program, onEditProgram, onEditInitiative }: ProgramCardProps) => {
  const { getInitiativesByProgramId, getPersonByInitiativeId } = useCriticalObjectives();
  const { tasks } = useTasks();
  const styles = ragStyles[program.ragStatus];
  const initiatives = getInitiativesByProgramId(program.id);

  const tasksLinkedToProgram = tasks.filter(
    (t) => t.linkedProgramIds?.includes(program.id)
  );

  const getTasksLinkedToInitiative = (initiativeId: string) =>
    tasks.filter((t) => t.linkedInitiativeIds?.includes(initiativeId));

  return (
    <div
      onClick={() => onEditProgram(program)}
      className={`backdrop-blur-xl ${styles.bg} rounded-xl p-5 border ${styles.border} shadow-2xl flex flex-col transition-all duration-300 hover:opacity-90 h-full cursor-pointer`}
    >
      {/* Header: Title + RAG badge */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <h3 className="text-lg font-semibold text-white leading-tight truncate">
          {program.title}
        </h3>
        <span className="flex-shrink-0 flex items-center gap-2">
          {tasksLinkedToProgram.length > 0 && (
            <LinkedTaskEmojis tasks={tasksLinkedToProgram} />
          )}
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium border ${styles.badge} ${styles.badgeText}`}
          >
            {ragEmoji[program.ragStatus]} {program.ragStatus.toUpperCase()}
          </span>
        </span>
      </div>

      {/* Meta row: Priority + Target Date */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="px-2.5 py-1 rounded-md text-xs font-medium backdrop-blur-md bg-white/10 border border-purple-300/20 text-purple-200/90">
          {priorityLabel[program.priority] ?? program.priority}
        </span>
        {program.targetDate && (
          <span className="px-2.5 py-1 rounded-md text-xs font-medium backdrop-blur-md bg-white/10 border border-purple-300/20 text-purple-200/90">
            📅 {new Date(program.targetDate).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Initiatives list */}
      <div className="flex-1 flex flex-col">
        <p className={`text-xs font-medium uppercase tracking-wider ${styles.text} mb-2 flex-shrink-0`}>
          Initiatives ({initiatives.length})
        </p>
        {initiatives.length === 0 ? (
          <p className={`text-sm ${styles.text} italic`}>No linked initiatives</p>
        ) : (
          <div className="space-y-2">
            {initiatives.map((init) => {
              const dri = getPersonByInitiativeId(init.id);
              const initStyle = ragStyles[init.ragStatus];
              return (
                <div
                  key={init.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditInitiative(init);
                  }}
                  className={`px-3 py-2 rounded-lg backdrop-blur-md ${initStyle.initBg} border ${initStyle.initBorder} transition-all duration-200 cursor-pointer ${initStyle.initHoverBg}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm text-white font-medium truncate">
                      {ragEmoji[init.ragStatus]} {init.title}
                    </span>
                    <span className="flex-shrink-0 flex items-center gap-1.5">
                      {(() => {
                        const linkedTasks = getTasksLinkedToInitiative(init.id);
                        return linkedTasks.length > 0 ? <LinkedTaskEmojis tasks={linkedTasks} /> : null;
                      })()}
                      {init.needsAttention && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/30 border border-amber-400/50 text-amber-200">
                          ⚠ Attn
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className={`text-xs ${initStyle.text}`}>
                      {init.priority}
                    </span>
                    {init.targetDate && (
                      <span className="text-xs text-purple-200/60">
                        📅 {new Date(init.targetDate).toLocaleDateString()}
                      </span>
                    )}
                    {dri && (
                      <span className="text-xs text-purple-200/60">
                        👤 {dri.firstname} {dri.lastname}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

