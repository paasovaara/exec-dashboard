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
      className="w-full max-w-2xl mx-auto p-6 backdrop-blur-xl bg-white/10 rounded-xl shadow-2xl border border-purple-300/20"
    >
      <h2 className="text-xl font-semibold text-white mb-4">
        Add New Task
      </h2>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="task-title"
            className="block text-sm font-medium text-purple-200/90 mb-2"
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
            className="w-full px-4 py-3 backdrop-blur-md bg-white/10 border border-purple-300/30 rounded-lg focus:ring-2 focus:ring-purple-400/50 focus:border-purple-300/50 text-white placeholder-purple-200/50 min-h-[44px] touch-manipulation shadow-lg transition-all duration-200"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <label className="flex items-center space-x-3 cursor-pointer min-h-[44px] touch-manipulation">
            <input
              type="checkbox"
              checked={urgency}
              onChange={(e) => setUrgency(e.target.checked)}
              className="w-5 h-5 text-purple-400 border-purple-300/30 rounded focus:ring-purple-400 focus:ring-2 bg-white/10"
            />
            <span className="text-sm font-medium text-purple-200/90">
              Urgent
            </span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer min-h-[44px] touch-manipulation">
            <input
              type="checkbox"
              checked={importance}
              onChange={(e) => setImportance(e.target.checked)}
              className="w-5 h-5 text-purple-400 border-purple-300/30 rounded focus:ring-purple-400 focus:ring-2 bg-white/10"
            />
            <span className="text-sm font-medium text-purple-200/90">
              Important
            </span>
          </label>
        </div>
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent min-h-[44px] touch-manipulation shadow-lg hover:shadow-xl active:scale-[0.98]"
        >
          Add Task
        </button>
      </div>
    </form>
  );
};

