import { Task } from '../types/task.ts';

interface TaskDetailProps {
  task: Task | null;
  onClose: () => void;
}

export const TaskDetail = ({ task, onClose }: TaskDetailProps) => {
  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Task Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl font-bold min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              Title
            </h3>
            <p className="text-lg text-gray-900 dark:text-gray-100">
              {task.title}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              Priority
            </h3>
            <div className="flex gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  task.urgency
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}
              >
                {task.urgency ? 'Urgent' : 'Not Urgent'}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  task.importance
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}
              >
                {task.importance ? 'Important' : 'Not Important'}
              </span>
            </div>
          </div>
          {task.details && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                Details
              </h3>
              <p className="text-gray-700 dark:text-gray-300">{task.details}</p>
            </div>
          )}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              Additional metadata fields can be added here in the future.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

