import { Task, QuadrantType } from '../types/task.ts';
import { MatrixQuadrant } from './MatrixQuadrant';
import { useTasks } from '../context/TaskContext';

interface EisenhowerMatrixProps {
  onTaskClick: (task: Task) => void;
}

export const EisenhowerMatrix = ({ onTaskClick }: EisenhowerMatrixProps) => {
  const { getTasksByQuadrant } = useTasks();

  const quadrants: QuadrantType[] = [
    'urgent-important',
    'important-not-urgent',
    'urgent-not-important',
    'not-important-not-urgent',
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-200 to-indigo-200 bg-clip-text text-transparent mb-8 text-center">
        Eisenhower Matrix
      </h1>
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

