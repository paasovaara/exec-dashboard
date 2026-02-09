import { useState } from 'react';
import { CriticalObjectivesForm } from '../components/CriticalObjectivesForm';
import { ProgramCard } from '../components/ProgramCard';
import { useCriticalObjectives } from '../context/CriticalObjectivesContext';

export const CosPage = () => {
  const { programs, loading } = useCriticalObjectives();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="max-w-7xl mx-auto px-4 pt-8 pb-4">
          {/* Title row with + button */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white text-2xl font-light shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.95]"
              aria-label="Create new"
            >
              +
            </button>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-200 to-indigo-200 bg-clip-text text-transparent">
              Critical Objectives
            </h1>
          </div>

          {loading ? (
            <p className="text-purple-200/70 text-center">Loading...</p>
          ) : programs.length === 0 ? (
            <div className="backdrop-blur-xl bg-purple-500/10 border border-purple-400/20 rounded-lg p-6">
              <p className="text-purple-200/60 text-center italic">
                No programs yet. Press + to create one.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
              {programs.map((program) => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal overlay */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowForm(false);
          }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal content */}
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-purple-200 hover:text-white transition-all duration-200"
              aria-label="Close"
            >
              ✕
            </button>
            <CriticalObjectivesForm onDone={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

