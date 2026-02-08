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

  return (
    <div className="backdrop-blur-xl bg-white/10 rounded-xl p-4 border border-purple-300/20 shadow-2xl h-full flex flex-col transition-all duration-300 hover:bg-white/15">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-1">
          {label.title}
        </h3>
        <p className="text-sm text-purple-200/80">{label.subtitle}</p>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto min-h-0">
        {tasks.length === 0 ? (
          <p className="text-sm text-purple-200/60 italic text-center py-4">
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

