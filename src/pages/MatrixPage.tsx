import { useState } from 'react';
import { EisenhowerMatrix } from '../components/matrix/EisenhowerMatrix';
import { TaskForm } from '../components/matrix/TaskForm';
import { Modal } from '../components/Modal';
import { Task } from '../types/task.ts';
import { useTasks } from '../context/TaskContext';

export const MatrixPage = () => {
  const { deleteTask } = useTasks();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleTaskClick = (task: Task) => {
    setEditingTask(task);
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

      {/* Edit Task modal */}
      {editingTask && (
        <Modal title="Update Task" onClose={() => setEditingTask(null)}>
          <TaskForm
            key={editingTask.id}
            initialData={editingTask}
            onDone={() => setEditingTask(null)}
            onDelete={async () => {
              await deleteTask(editingTask.id);
              setEditingTask(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
};
