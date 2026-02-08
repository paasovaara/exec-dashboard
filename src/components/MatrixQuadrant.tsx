import { Task, QuadrantType } from '../types/task.ts';
import { TaskItem } from './TaskItem';

interface MatrixQuadrantProps {
  quadrant: QuadrantType;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const quadrantLabels: Record<QuadrantType, { title: string; subtitle: string }> = {
  'urgent-important': {
    title: 'Urgent & Important',
    subtitle: 'Do First',
  },
  'important-not-urgent': {
    title: 'Important & Not Urgent',
    subtitle: 'Schedule',
  },
  'urgent-not-important': {
    title: 'Urgent & Not Important',
    subtitle: 'Delegate',
  },
  'not-important-not-urgent': {
    title: 'Not Important & Not Urgent',
    subtitle: 'Eliminate',
  },
};

export const MatrixQuadrant = ({
  quadrant,
  tasks,
  onTaskClick,
}: MatrixQuadrantProps) => {
  const label = quadrantLabels[quadrant];

  // Define quadrant-specific color schemes
  const quadrantStyles: Record<QuadrantType, { bg: string; border: string; text: string }> = {
    'urgent-important': {
      bg: 'bg-red-500/20',
      border: 'border-red-400/30',
      text: 'text-red-200/90',
    },
    'important-not-urgent': {
      bg: 'bg-emerald-500/20',
      border: 'border-emerald-400/30',
      text: 'text-emerald-200/90',
    },
    'urgent-not-important': {
      bg: 'bg-slate-400/15',
      border: 'border-slate-300/25',
      text: 'text-slate-200/80',
    },
    'not-important-not-urgent': {
      bg: 'bg-gray-600/10',
      border: 'border-gray-500/15',
      text: 'text-gray-400/60',
    },
  };

  const styles = quadrantStyles[quadrant];

  return (
    <div className={`backdrop-blur-xl ${styles.bg} rounded-xl p-4 border ${styles.border} shadow-2xl h-full flex flex-col transition-all duration-300 hover:opacity-90`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-1">
          {label.title}
        </h3>
        <p className={`text-sm ${styles.text}`}>{label.subtitle}</p>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto min-h-0">
        {tasks.length === 0 ? (
          <p className={`text-sm ${styles.text} italic text-center py-4`}>
            No tasks
          </p>
        ) : (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
            />
          ))
        )}
      </div>
    </div>
  );
};

