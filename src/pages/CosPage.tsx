import { CriticalObjectivesForm } from '../components/CriticalObjectivesForm';
import { ProgramCard } from '../components/ProgramCard';
import { useCriticalObjectives } from '../context/CriticalObjectivesContext';

export const CosPage = () => {
  const { programs, loading } = useCriticalObjectives();

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="max-w-7xl mx-auto px-4 pt-8 pb-4">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-200 to-indigo-200 bg-clip-text text-transparent mb-8 text-center">
            Critical Objectives
          </h1>
          {loading ? (
            <p className="text-purple-200/70 text-center">Loading...</p>
          ) : programs.length === 0 ? (
            <div className="backdrop-blur-xl bg-purple-500/10 border border-purple-400/20 rounded-lg p-6">
              <p className="text-purple-200/60 text-center italic">
                No programs yet. Create one below to get started.
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
      <div className="flex-shrink-0 px-4 pb-4">
        <div className="max-w-7xl mx-auto">
          <CriticalObjectivesForm />
        </div>
      </div>
    </div>
  );
};

