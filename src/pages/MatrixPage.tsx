import { useState } from 'react';
import { EisenhowerMatrix } from '../components/EisenhowerMatrix';
import { TaskForm } from '../components/TaskForm';
import { TaskDetail } from '../components/TaskDetail';
import { Modal } from '../components/Modal';
import { Task } from '../types/task.ts';

export const MatrixPage = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

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
          <EisenhowerMatrix onTaskClick={handleTaskClick} onAdd={() => setShowCreateForm(true)} />
        </div>
      </div>

      {/* Add Task modal */}
      {showCreateForm && (
        <Modal title="Add New Task" onClose={() => setShowCreateForm(false)}>
          <TaskForm onDone={() => setShowCreateForm(false)} />
        </Modal>
      )}

      {selectedTask && (
        <TaskDetail task={selectedTask} onClose={handleCloseDetail} />
      )}
    </div>
  );
};
