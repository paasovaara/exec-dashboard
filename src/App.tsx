import { useState } from 'react';
import { EisenhowerMatrix } from './components/EisenhowerMatrix';
import { TaskForm } from './components/TaskForm';
import { TaskDetail } from './components/TaskDetail';
import { Task } from './types/task.ts';

function App() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleCloseDetail = () => {
    setSelectedTask(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-black py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <EisenhowerMatrix onTaskClick={handleTaskClick} />
        <TaskForm />
        {selectedTask && (
          <TaskDetail task={selectedTask} onClose={handleCloseDetail} />
        )}
      </div>
    </div>
  );
}

export default App;
