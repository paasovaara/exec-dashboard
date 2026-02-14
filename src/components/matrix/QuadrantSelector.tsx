import { QuadrantType } from '../../types/task.ts';

interface QuadrantSelectorProps {
  selectedQuadrant: QuadrantType | null;
  onSelect: (quadrant: QuadrantType) => void;
}

type QuadrantConfig = {
  type: QuadrantType;
  bg: string;
  border: string;
  hoverBg: string;
};

const quadrants: QuadrantConfig[] = [
  {
    type: 'urgent-important',
    bg: 'bg-red-500/20',
    border: 'border-red-400/30',
    hoverBg: 'hover:bg-red-500/30',
  },
  {
    type: 'important-not-urgent',
    bg: 'bg-emerald-500/20',
    border: 'border-emerald-400/30',
    hoverBg: 'hover:bg-emerald-500/30',
  },
  {
    type: 'urgent-not-important',
    bg: 'bg-slate-400/15',
    border: 'border-slate-300/25',
    hoverBg: 'hover:bg-slate-400/25',
  },
  {
    type: 'not-important-not-urgent',
    bg: 'bg-gray-600/10',
    border: 'border-gray-500/15',
    hoverBg: 'hover:bg-gray-600/20',
  },
];

export const QuadrantSelector = ({
  selectedQuadrant,
  onSelect,
}: QuadrantSelectorProps) => {
  return (
    <div className="grid grid-cols-2 gap-1 w-20 h-20">
      {quadrants.map((quadrant) => {
        const isSelected = selectedQuadrant === quadrant.type;
        return (
          <button
            key={quadrant.type}
            type="button"
            onClick={() => onSelect(quadrant.type)}
            className={`
              backdrop-blur-md rounded border transition-all duration-200
              ${quadrant.bg}
              ${quadrant.border}
              ${quadrant.hoverBg}
              ${isSelected ? 'ring-2 ring-purple-400/50 ring-offset-1 ring-offset-transparent scale-[0.95]' : ''}
              shadow-md hover:shadow-lg active:scale-[0.92]
              relative aspect-square
            `}
            aria-label={quadrant.type}
          >
            <svg
              className={`absolute inset-0 m-auto w-5 h-5 text-white drop-shadow-lg transition-opacity duration-200 ${
                isSelected ? 'opacity-100' : 'opacity-0'
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </button>
        );
      })}
    </div>
  );
};

