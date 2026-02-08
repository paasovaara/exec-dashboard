import { useState, FormEvent } from 'react';
import { useTasks } from '../context/TaskContext';

export const TaskForm = () => {
  const { addTask } = useTasks();
  const [title, setTitle] = useState('');
  const [urgency, setUrgency] = useState(false);
  const [importance, setImportance] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title.trim()) {
      addTask({
        title: title.trim(),
        urgency,
        importance,
      });
      setTitle('');
      setUrgency(false);
      setImportance(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Add New Task
      </h2>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="task-title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Task Title
          </label>
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title..."
            required
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 min-h-[44px] touch-manipulation"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <label className="flex items-center space-x-3 cursor-pointer min-h-[44px] touch-manipulation">
            <input
              type="checkbox"
              checked={urgency}
              onChange={(e) => setUrgency(e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Urgent
            </span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer min-h-[44px] touch-manipulation">
            <input
              type="checkbox"
              checked={importance}
              onChange={(e) => setImportance(e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Important
            </span>
          </label>
        </div>
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[44px] touch-manipulation"
        >
          Add Task
        </button>
      </div>
    </form>
  );
};

