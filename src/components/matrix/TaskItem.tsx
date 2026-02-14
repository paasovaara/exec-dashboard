import { Task } from '../../types/task.ts';

interface TaskItemProps {
  task: Task;
  onClick: () => void;
}

function isDueOrOverdue(task: Task): boolean {
  if (!task.dueDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(task.dueDate);
  due.setHours(0, 0, 0, 0);
  return due <= today;
}

export const TaskItem = ({ task, onClick }: TaskItemProps) => {
  const overdue = isDueOrOverdue(task);

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 backdrop-blur-md bg-white/10 border border-purple-300/30 rounded-lg hover:bg-white/20 hover:border-purple-300/50 transition-all duration-200 active:scale-[0.98] min-h-[44px] touch-manipulation shadow-lg flex items-center justify-between gap-2 ${overdue ? 'animate-buzz' : ''}`}
    >
      <span className="text-white font-medium truncate">
        {task.title}
      </span>
      {overdue && (
        <span className="flex-shrink-0 text-lg" aria-label="Due or overdue">
          ⏰
        </span>
      )}
    </button>
  );
};
