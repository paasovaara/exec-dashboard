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
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          {label.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{label.subtitle}</p>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto min-h-0">
        {tasks.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-500 italic text-center py-4">
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

