import { Program, Initiative, RagStatus } from '../../types/critical-objectives';
import { useCriticalObjectives } from '../../context/CriticalObjectivesContext';

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

export const ProgramCard = ({ program, onEditProgram, onEditInitiative }: ProgramCardProps) => {
  const { getInitiativesByProgramId, getPersonByInitiativeId } = useCriticalObjectives();
  const styles = ragStyles[program.ragStatus];
  const initiatives = getInitiativesByProgramId(program.id);

  return (
    <div
      onClick={() => onEditProgram(program)}
      className={`backdrop-blur-xl ${styles.bg} rounded-xl p-5 border ${styles.border} shadow-2xl flex flex-col transition-all duration-300 hover:opacity-90 h-full cursor-pointer`}
    >
      {/* Header: Title + RAG badge */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <h3 className="text-lg font-semibold text-white leading-tight">
          {program.title}
        </h3>
        <span
          className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium border ${styles.badge} ${styles.badgeText}`}
        >
          {ragEmoji[program.ragStatus]} {program.ragStatus.toUpperCase()}
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
      <div className="flex-1 flex flex-col min-h-0">
        <p className={`text-xs font-medium uppercase tracking-wider ${styles.text} mb-2 flex-shrink-0`}>
          Initiatives ({initiatives.length})
        </p>
        {initiatives.length === 0 ? (
          <p className={`text-sm ${styles.text} italic`}>No linked initiatives</p>
        ) : (
          <div className="space-y-2 overflow-y-auto min-h-0">
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
                    {init.needsAttention && (
                      <span className="flex-shrink-0 text-xs px-1.5 py-0.5 rounded bg-amber-500/30 border border-amber-400/50 text-amber-200">
                        ⚠ Attn
                      </span>
                    )}
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

