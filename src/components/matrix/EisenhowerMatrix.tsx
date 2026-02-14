import { Task, QuadrantType } from '../../types/task.ts';
import { MatrixQuadrant } from './MatrixQuadrant';
import { useTasks } from '../../context/TaskContext';

interface EisenhowerMatrixProps {
  onTaskClick: (task: Task) => void;
  onAdd: () => void;
}

export const EisenhowerMatrix = ({ onTaskClick, onAdd }: EisenhowerMatrixProps) => {
  const { getTasksByQuadrant } = useTasks();

  const quadrants: QuadrantType[] = [
    'urgent-important',
    'important-not-urgent',
    'urgent-not-important',
    'not-important-not-urgent',
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-center gap-4 mb-8">
        <button
          type="button"
          onClick={onAdd}
          className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white text-2xl font-light shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.95]"
          aria-label="Add new task"
        >
          +
        </button>
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-200 to-indigo-200 bg-clip-text text-transparent">
          Eisenhower Matrix
        </h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quadrants.map((quadrant) => (
          <MatrixQuadrant
            key={quadrant}
            quadrant={quadrant}
            tasks={getTasksByQuadrant(quadrant)}
            onTaskClick={onTaskClick}
          />
        ))}
      </div>
    </div>
  );
};

