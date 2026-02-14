import { Task } from '../../types/task.ts';

interface TaskDetailProps {
  task: Task | null;
  onClose: () => void;
}

export const TaskDetail = ({ task, onClose }: TaskDetailProps) => {
  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="backdrop-blur-xl bg-white/10 rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-purple-300/20">
        <div className="sticky top-0 backdrop-blur-md bg-white/10 border-b border-purple-300/20 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">
            Task Details
          </h2>
          <button
            onClick={onClose}
            className="text-purple-200/80 hover:text-white text-2xl font-bold min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation transition-colors duration-200"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-purple-200/70 uppercase tracking-wide mb-2">
              Title
            </h3>
            <p className="text-lg text-white">
              {task.title}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-purple-200/70 uppercase tracking-wide mb-2">
              Priority
            </h3>
            <div className="flex gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium backdrop-blur-md ${
                  task.urgency
                    ? 'bg-red-500/30 text-red-200 border border-red-400/30'
                    : 'bg-white/10 text-purple-200/80 border border-purple-300/20'
                }`}
              >
                {task.urgency ? 'Urgent' : 'Not Urgent'}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium backdrop-blur-md ${
                  task.importance
                    ? 'bg-blue-500/30 text-blue-200 border border-blue-400/30'
                    : 'bg-white/10 text-purple-200/80 border border-purple-300/20'
                }`}
              >
                {task.importance ? 'Important' : 'Not Important'}
              </span>
            </div>
          </div>
          {task.details && (
            <div>
              <h3 className="text-sm font-semibold text-purple-200/70 uppercase tracking-wide mb-2">
                Details
              </h3>
              <p className="text-purple-200/90">{task.details}</p>
            </div>
          )}
          <div className="pt-4 border-t border-purple-300/20">
            <p className="text-sm text-purple-200/60 italic">
              Additional metadata fields can be added here in the future.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

