import { useState, FormEvent } from 'react';
import { useTasks } from '../context/TaskContext';
import { QuadrantSelector } from './QuadrantSelector';
import { QuadrantType } from '../types/task.ts';

export const TaskForm = () => {
  const { addTask } = useTasks();
  const [title, setTitle] = useState('');
  const [selectedQuadrant, setSelectedQuadrant] = useState<QuadrantType | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title.trim() && selectedQuadrant) {
      // Convert quadrant to urgency and importance
      const urgency = selectedQuadrant === 'urgent-important' || selectedQuadrant === 'urgent-not-important';
      const importance = selectedQuadrant === 'urgent-important' || selectedQuadrant === 'important-not-urgent';
      
      await addTask({
        title: title.trim(),
        urgency,
        importance,
      });
      setTitle('');
      setSelectedQuadrant(null);
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
          <div className="flex items-center gap-3">
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              required
              className="flex-1 px-4 py-3 backdrop-blur-md bg-white/10 border border-purple-300/30 rounded-lg focus:ring-2 focus:ring-purple-400/50 focus:border-purple-300/50 text-white placeholder-purple-200/50 min-h-[44px] touch-manipulation shadow-lg transition-all duration-200"
            />
            <div className="flex-shrink-0">
              <QuadrantSelector
                selectedQuadrant={selectedQuadrant}
                onSelect={setSelectedQuadrant}
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={!selectedQuadrant}
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 disabled:from-purple-500/50 disabled:to-indigo-500/50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent min-h-[44px] touch-manipulation shadow-lg hover:shadow-xl active:scale-[0.98] disabled:active:scale-100"
        >
          Add Task
        </button>
      </div>
    </form>
  );
};

