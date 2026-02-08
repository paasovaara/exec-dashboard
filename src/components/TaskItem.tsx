import { Task } from '../types/task.ts';

interface TaskItemProps {
  task: Task;
  onClick: () => void;
}

export const TaskItem = ({ task, onClick }: TaskItemProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 active:bg-gray-100 dark:active:bg-gray-600 min-h-[44px] touch-manipulation"
    >
      <span className="text-gray-900 dark:text-gray-100 font-medium">
        {task.title}
      </span>
    </button>
  );
};

