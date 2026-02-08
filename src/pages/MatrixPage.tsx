import { useState } from 'react';
import { EisenhowerMatrix } from '../components/EisenhowerMatrix';
import { TaskForm } from '../components/TaskForm';
import { TaskDetail } from '../components/TaskDetail';
import { Task } from '../types/task.ts';

export const MatrixPage = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleCloseDetail = () => {
    setSelectedTask(null);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="max-w-7xl mx-auto px-4 pt-8 pb-4">
          <EisenhowerMatrix onTaskClick={handleTaskClick} />
        </div>
      </div>
      <div className="flex-shrink-0 px-4 pb-4">
        <div className="max-w-7xl mx-auto">
          <TaskForm />
        </div>
      </div>
      {selectedTask && (
        <TaskDetail task={selectedTask} onClose={handleCloseDetail} />
      )}
    </div>
  );
};

