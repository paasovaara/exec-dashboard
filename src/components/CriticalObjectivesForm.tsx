import { useState, FormEvent } from 'react';
import { useCriticalObjectives } from '../context/CriticalObjectivesContext';
import { RagStatus, Priority, Program, Initiative } from '../types/critical-objectives';
import { ConfirmDialog } from './ConfirmDialog';

type EntityType = 'program' | 'initiative' | 'person';

// Shared styles
const inputClass =
  'w-full px-4 py-3 backdrop-blur-md bg-white/10 border border-purple-300/30 rounded-lg focus:ring-2 focus:ring-purple-400/50 focus:border-purple-300/50 text-white placeholder-purple-200/50 min-h-[44px] touch-manipulation shadow-lg transition-all duration-200';
const labelClass = 'block text-sm font-medium text-purple-200/90 mb-1';
const selectClass =
  'w-full px-4 py-3 backdrop-blur-md bg-white/10 border border-purple-300/30 rounded-lg focus:ring-2 focus:ring-purple-400/50 focus:border-purple-300/50 text-white min-h-[44px] touch-manipulation shadow-lg transition-all duration-200 appearance-none [&>option]:bg-indigo-950 [&>option]:text-white';
const buttonClass =
  'w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 disabled:from-purple-500/50 disabled:to-indigo-500/50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent min-h-[44px] touch-manipulation shadow-lg hover:shadow-xl active:scale-[0.98]';

const RagStatusSelect = ({
  value,
  onChange,
}: {
  value: RagStatus;
  onChange: (v: RagStatus) => void;
}) => (
  <div>
    <label className={labelClass}>RAG Status</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as RagStatus)}
      className={selectClass}
    >
      <option value="green">🟢 Green</option>
      <option value="amber">🟡 Amber</option>
      <option value="red">🔴 Red</option>
    </select>
  </div>
);

const PrioritySelect = ({
  value,
  onChange,
}: {
  value: Priority;
  onChange: (v: Priority) => void;
}) => (
  <div>
    <label className={labelClass}>Priority</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as Priority)}
      className={selectClass}
    >
      <option value="P0">P0 (Highest)</option>
      <option value="P1">P1 (Default)</option>
      <option value="P2">P2 (Lowest)</option>
    </select>
  </div>
);

const deleteButtonClass =
  'w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-transparent min-h-[44px] touch-manipulation shadow-lg hover:shadow-xl active:scale-[0.98] border border-red-500/50';

// --- Program Form ---
interface ProgramFormProps {
  onDone: () => void;
  initialData?: Program;
  onDelete?: () => void;
}

export const ProgramForm = ({ onDone, initialData, onDelete }: ProgramFormProps) => {
  const { addProgram, updateProgram, initiatives } = useCriticalObjectives();
  const isEdit = !!initialData;

  const [title, setTitle] = useState(initialData?.title ?? '');
  const [ragStatus, setRagStatus] = useState<RagStatus>(initialData?.ragStatus ?? 'green');
  const [priority, setPriority] = useState<Priority>(initialData?.priority ?? 'P1');
  const [targetDate, setTargetDate] = useState(initialData?.targetDate ?? '');
  const [selectedInitiativeIds, setSelectedInitiativeIds] = useState<string[]>(
    initialData?.initiativeIds ?? []
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const toggleInitiative = (id: string) => {
    setSelectedInitiativeIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (isEdit) {
      await updateProgram(initialData.id, {
        title: title.trim(),
        ragStatus,
        priority,
        targetDate: targetDate || null,
        initiativeIds: selectedInitiativeIds,
      });
    } else {
      await addProgram({
        title: title.trim(),
        ragStatus,
        priority,
        targetDate: targetDate || null,
        initiativeIds: selectedInitiativeIds,
      });
      setTitle('');
      setRagStatus('green');
      setPriority('P1');
      setTargetDate('');
      setSelectedInitiativeIds([]);
    }
    onDone();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Program title..."
          required
          className={inputClass}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <RagStatusSelect value={ragStatus} onChange={setRagStatus} />
        <PrioritySelect value={priority} onChange={setPriority} />
        <div>
          <label className={labelClass}>Target Date</label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>
      {initiatives.length > 0 && (
        <div>
          <label className={labelClass}>Link Initiatives</label>
          <div className="space-y-2 max-h-32 overflow-y-auto p-2 backdrop-blur-md bg-white/5 border border-purple-300/20 rounded-lg">
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
          </div>
        </div>
      )}
      <div className={`flex ${isEdit && onDelete ? 'justify-between' : 'justify-end'}`}>
        <button type="submit" className={buttonClass}>
          {isEdit ? 'Update Program' : 'Add Program'}
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
          message="Are you sure you want to delete this program? This action cannot be undone."
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

// --- Initiative Form ---
interface InitiativeFormProps {
  onDone: () => void;
  initialData?: Initiative;
  onDelete?: () => void;
}

export const InitiativeForm = ({ onDone, initialData, onDelete }: InitiativeFormProps) => {
  const { addInitiative, updateInitiative, persons } = useCriticalObjectives();
  const isEdit = !!initialData;

  const [title, setTitle] = useState(initialData?.title ?? '');
  const [ragStatus, setRagStatus] = useState<RagStatus>(initialData?.ragStatus ?? 'green');
  const [priority, setPriority] = useState<Priority>(initialData?.priority ?? 'P1');
  const [targetDate, setTargetDate] = useState(initialData?.targetDate ?? '');
  const [driId, setDriId] = useState(initialData?.driId ?? '');
  const [needsAttention, setNeedsAttention] = useState(initialData?.needsAttention ?? false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (isEdit) {
      await updateInitiative(initialData.id, {
        title: title.trim(),
        ragStatus,
        priority,
        targetDate: targetDate || null,
        driId: driId || null,
        needsAttention,
      });
    } else {
      await addInitiative({
        title: title.trim(),
        ragStatus,
        priority,
        targetDate: targetDate || null,
        driId: driId || null,
        needsAttention,
      });
      setTitle('');
      setRagStatus('green');
      setPriority('P1');
      setTargetDate('');
      setDriId('');
      setNeedsAttention(false);
    }
    onDone();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Initiative title..."
          required
          className={inputClass}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <RagStatusSelect value={ragStatus} onChange={setRagStatus} />
        <PrioritySelect value={priority} onChange={setPriority} />
        <div>
          <label className={labelClass}>Target Date</label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>DRI (Person)</label>
          <select
            value={driId}
            onChange={(e) => setDriId(e.target.value)}
            className={selectClass}
          >
            <option value="">— None —</option>
            {persons.map((p) => (
              <option key={p.id} value={p.id}>
                {p.firstname} {p.lastname}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 cursor-pointer text-purple-200/90 hover:text-white transition-colors">
            <input
              type="checkbox"
              checked={needsAttention}
              onChange={(e) => setNeedsAttention(e.target.checked)}
              className="rounded border-purple-300/30 bg-white/10 text-purple-500 focus:ring-purple-400/50"
            />
            <span className="text-sm font-medium">Needs Attention</span>
          </label>
        </div>
      </div>
      <div className={`flex ${isEdit && onDelete ? 'justify-between' : 'justify-end'}`}>
        <button type="submit" className={buttonClass}>
          {isEdit ? 'Update Initiative' : 'Add Initiative'}
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
          message="Are you sure you want to delete this initiative? It will also be unlinked from all programs. This action cannot be undone."
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

// --- Person Form ---
const PersonForm = ({ onDone }: { onDone: () => void }) => {
  const { addPerson } = useCriticalObjectives();
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [title, setTitle] = useState('');
  const [avatar, setAvatar] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!firstname.trim() || !lastname.trim()) return;
    await addPerson({
      firstname: firstname.trim(),
      lastname: lastname.trim(),
      title: title.trim() || null,
      avatar: avatar.trim() || null,
    });
    setFirstname('');
    setLastname('');
    setTitle('');
    setAvatar('');
    onDone();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>First Name *</label>
          <input
            type="text"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            placeholder="First name..."
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Last Name *</label>
          <input
            type="text"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            placeholder="Last name..."
            required
            className={inputClass}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Job title..."
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Avatar URL</label>
          <input
            type="text"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="https://..."
            className={inputClass}
          />
        </div>
      </div>
      <button type="submit" className={buttonClass}>
        Add Person
      </button>
    </form>
  );
};

// --- Main Form Component (Create New) ---
interface CriticalObjectivesFormProps {
  onDone?: () => void;
}

export const CriticalObjectivesForm = ({ onDone }: CriticalObjectivesFormProps) => {
  const [entityType, setEntityType] = useState<EntityType>('initiative');

  const entityTabs: { type: EntityType; label: string }[] = [
    { type: 'program', label: 'Program' },
    { type: 'initiative', label: 'Initiative' },
    { type: 'person', label: 'Person' },
  ];

  const handleDone = () => {
    onDone?.();
  };

  return (
    <>
      {/* Entity type tabs */}
      <div className="flex gap-1 mb-6 p-1 backdrop-blur-md bg-white/5 rounded-lg border border-purple-300/15">
        {entityTabs.map(({ type, label }) => (
          <button
            key={type}
            type="button"
            onClick={() => setEntityType(type)}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              entityType === type
                ? 'bg-purple-500/30 text-white border border-purple-400/50 shadow-md'
                : 'text-purple-200/70 hover:text-white hover:bg-purple-500/10'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Render the appropriate sub-form */}
      {entityType === 'program' && <ProgramForm onDone={handleDone} />}
      {entityType === 'initiative' && <InitiativeForm onDone={handleDone} />}
      {entityType === 'person' && <PersonForm onDone={handleDone} />}
    </>
  );
};
