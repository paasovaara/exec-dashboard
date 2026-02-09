import { useState } from 'react';
import { CriticalObjectivesForm, ProgramForm, InitiativeForm } from '../components/CriticalObjectivesForm';
import { Modal } from '../components/Modal';
import { ProgramCard } from '../components/ProgramCard';
import { useCriticalObjectives } from '../context/CriticalObjectivesContext';
import { Program, Initiative } from '../types/critical-objectives';

export const CosPage = () => {
  const { programs, loading, deleteProgram, deleteInitiative } = useCriticalObjectives();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [editingInitiative, setEditingInitiative] = useState<Initiative | null>(null);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="max-w-7xl mx-auto px-4 pt-8 pb-4">
          {/* Title row with + button */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              type="button"
              onClick={() => setShowCreateForm(true)}
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
                <ProgramCard
                  key={program.id}
                  program={program}
                  onEditProgram={setEditingProgram}
                  onEditInitiative={setEditingInitiative}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create New modal */}
      {showCreateForm && (
        <Modal title="Create New" onClose={() => setShowCreateForm(false)}>
          <CriticalObjectivesForm onDone={() => setShowCreateForm(false)} />
        </Modal>
      )}

      {/* Edit Program modal */}
      {editingProgram && (
        <Modal title="Update Program" onClose={() => setEditingProgram(null)}>
          <ProgramForm
            key={editingProgram.id}
            initialData={editingProgram}
            onDone={() => setEditingProgram(null)}
            onDelete={async () => {
              await deleteProgram(editingProgram.id);
              setEditingProgram(null);
            }}
          />
        </Modal>
      )}

      {/* Edit Initiative modal */}
      {editingInitiative && (
        <Modal title="Update Initiative" onClose={() => setEditingInitiative(null)}>
          <InitiativeForm
            key={editingInitiative.id}
            initialData={editingInitiative}
            onDone={() => setEditingInitiative(null)}
            onDelete={async () => {
              await deleteInitiative(editingInitiative.id);
              setEditingInitiative(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
};
