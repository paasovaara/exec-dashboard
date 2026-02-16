import { useState, FormEvent } from 'react';
import { useTasks } from '../../context/TaskContext';
import { useCriticalObjectives } from '../../context/CriticalObjectivesContext';
import { QuadrantSelector } from './QuadrantSelector';
import { Task, QuadrantType } from '../../types/task.ts';
import { ConfirmDialog } from '../critical-objectives/ConfirmDialog';

interface TaskFormProps {
  onDone: () => void;
  initialData?: Task;
  onDelete?: () => void;
}

const inputClass =
  'w-full px-4 py-3 backdrop-blur-md bg-white/10 border border-purple-300/30 rounded-lg focus:ring-2 focus:ring-purple-400/50 focus:border-purple-300/50 text-white placeholder-purple-200/50 min-h-[44px] touch-manipulation shadow-lg transition-all duration-200';
const labelClass = 'block text-sm font-medium text-purple-200/90 mb-1';
const buttonClass =
  'w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 disabled:from-purple-500/50 disabled:to-indigo-500/50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent min-h-[44px] touch-manipulation shadow-lg hover:shadow-xl active:scale-[0.98] disabled:active:scale-100';
const deleteButtonClass =
  'w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-transparent min-h-[44px] touch-manipulation shadow-lg hover:shadow-xl active:scale-[0.98] border border-red-500/50';

/** Format a Date as YYYY-MM-DD for the HTML date input. */
function formatDateForInput(date?: Date | null): string {
  if (!date) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Parse a YYYY-MM-DD string into a Date (local midnight). */
function parseDateInput(value: string): Date | null {
  if (!value) return null;
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function taskToQuadrant(task: Task): QuadrantType {
  if (task.urgency && task.importance) return 'urgent-important';
  if (!task.urgency && task.importance) return 'important-not-urgent';
  if (task.urgency && !task.importance) return 'urgent-not-important';
  return 'not-important-not-urgent';
}

export const TaskForm = ({ onDone, initialData, onDelete }: TaskFormProps) => {
  const { addTask, updateTask } = useTasks();
  const { initiatives, programs } = useCriticalObjectives();
  const isEdit = !!initialData;

  const [title, setTitle] = useState(initialData?.title ?? '');
  const [details, setDetails] = useState(initialData?.details ?? '');
  const [dueDateStr, setDueDateStr] = useState(formatDateForInput(initialData?.dueDate));
  const [selectedQuadrant, setSelectedQuadrant] = useState<QuadrantType | null>(
    initialData ? taskToQuadrant(initialData) : null
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedInitiativeIds, setSelectedInitiativeIds] = useState<string[]>(
    initialData?.linkedInitiativeIds ?? []
  );
  const [selectedProgramIds, setSelectedProgramIds] = useState<string[]>(
    initialData?.linkedProgramIds ?? []
  );

  const toggleInitiative = (id: string) => {
    setSelectedInitiativeIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleProgram = (id: string) => {
    setSelectedProgramIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title.trim() && selectedQuadrant) {
      const urgency = selectedQuadrant === 'urgent-important' || selectedQuadrant === 'urgent-not-important';
      const importance = selectedQuadrant === 'urgent-important' || selectedQuadrant === 'important-not-urgent';

      if (isEdit) {
        await updateTask(initialData.id, {
          title: title.trim(),
          urgency,
          importance,
          details: details.trim() || undefined,
          dueDate: parseDateInput(dueDateStr),
          linkedInitiativeIds: selectedInitiativeIds.length > 0 ? selectedInitiativeIds : undefined,
          linkedProgramIds: selectedProgramIds.length > 0 ? selectedProgramIds : undefined,
        });
      } else {
        await addTask({
          title: title.trim(),
          urgency,
          importance,
          details: details.trim() || undefined,
          dueDate: parseDateInput(dueDateStr),
          linkedInitiativeIds: selectedInitiativeIds.length > 0 ? selectedInitiativeIds : undefined,
          linkedProgramIds: selectedProgramIds.length > 0 ? selectedProgramIds : undefined,
        });
        setTitle('');
        setDetails('');
        setDueDateStr('');
        setSelectedQuadrant(null);
        setSelectedInitiativeIds([]);
        setSelectedProgramIds([]);
      }
      onDone();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Title *</label>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title..."
            required
            className={inputClass}
          />
          <div className="flex-shrink-0">
            <QuadrantSelector
              selectedQuadrant={selectedQuadrant}
              onSelect={setSelectedQuadrant}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Details</label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Optional details..."
            rows={3}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Due Date</label>
          <input
            type="date"
            value={dueDateStr}
            onChange={(e) => setDueDateStr(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>
      {(initiatives.length > 0 || programs.length > 0) && (
        <div>
          <label className={labelClass}>Link to Critical Objectives</label>
          <div className="space-y-2 max-h-40 overflow-y-auto p-2 backdrop-blur-md bg-white/5 border border-purple-300/20 rounded-lg">
            {programs.length > 0 && (
              <>
                <p className="text-xs font-medium uppercase tracking-wider text-purple-300/70">Programs</p>
                {programs.map((prog) => (
                  <label
                    key={prog.id}
                    className="flex items-center gap-2 cursor-pointer text-purple-200/90 hover:text-white transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedProgramIds.includes(prog.id)}
                      onChange={() => toggleProgram(prog.id)}
                      className="rounded border-purple-300/30 bg-white/10 text-purple-500 focus:ring-purple-400/50"
                    />
                    <span className="text-sm">{prog.title}</span>
                  </label>
                ))}
              </>
            )}
            {initiatives.length > 0 && (
              <>
                <p className="text-xs font-medium uppercase tracking-wider text-purple-300/70 mt-2">Initiatives</p>
                {initiatives.map((init) => (
                  <label
                    key={init.id}
                    className="flex items-center gap-2 cursor-pointer text-purple-200/90 hover:text-white transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedInitiativeIds.includes(init.id)}
                      onChange={() => toggleInitiative(init.id)}
                      className="rounded border-purple-300/30 bg-white/10 text-purple-500 focus:ring-purple-400/50"
                    />
                    <span className="text-sm">{init.title}</span>
                  </label>
                ))}
              </>
            )}
          </div>
        </div>
      )}
      <div className={`flex ${isEdit && onDelete ? 'justify-between' : 'justify-end'}`}>
        <button
          type="submit"
          disabled={!selectedQuadrant}
          className={buttonClass}
        >
          {isEdit ? 'Update Task' : 'Add Task'}
        </button>
        {isEdit && onDelete && (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className={deleteButtonClass}
          >
            Delete
          </button>
        )}
      </div>

      {showDeleteConfirm && onDelete && (
        <ConfirmDialog
          message="Are you sure you want to delete this task? This action cannot be undone."
          onConfirm={() => {
            onDelete();
            setShowDeleteConfirm(false);
          }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </form>
  );
};
