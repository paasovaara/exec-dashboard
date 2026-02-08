import { Task } from '../types/task.ts';

interface TaskItemProps {
  task: Task;
  onClick: () => void;
}

export const TaskItem = ({ task, onClick }: TaskItemProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-3 backdrop-blur-md bg-white/10 border border-purple-300/30 rounded-lg hover:bg-white/20 hover:border-purple-300/50 transition-all duration-200 active:scale-[0.98] min-h-[44px] touch-manipulation shadow-lg"
    >
      <span className="text-white font-medium">
        {task.title}
      </span>
    </button>
  );
};

