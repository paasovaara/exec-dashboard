import { Link, Outlet, useLocation } from 'react-router-dom';
import { useCallback } from 'react';

function exportLocalStorageData() {
  const dump = {
    tasks: JSON.parse(localStorage.getItem('eisenhower-tasks') ?? '[]'),
    activity: JSON.parse(localStorage.getItem('eisenhower-activity') ?? '[]'),
    persons: JSON.parse(localStorage.getItem('critical-objectives-persons') ?? '[]'),
    initiatives: JSON.parse(localStorage.getItem('critical-objectives-initiatives') ?? '[]'),
    programs: JSON.parse(localStorage.getItem('critical-objectives-programs') ?? '[]'),
  };
  const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'localstore-dump.json';
  a.click();
  URL.revokeObjectURL(url);
}

export const Layout = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleExport = useCallback(() => {
    exportLocalStorageData();
  }, []);

  return (
    <div className="h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-black flex flex-col overflow-hidden">
      <nav className="flex-shrink-0 backdrop-blur-xl bg-purple-900/20 border-b border-purple-400/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-6">
            <Link
              to="/matrix"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive('/matrix')
                  ? 'bg-purple-500/30 text-white border border-purple-400/50'
                  : 'text-purple-200/70 hover:text-white hover:bg-purple-500/10'
              }`}
            >
              Matrix
            </Link>
            <Link
              to="/cos"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive('/cos')
                  ? 'bg-purple-500/30 text-white border border-purple-400/50'
                  : 'text-purple-200/70 hover:text-white hover:bg-purple-500/10'
              }`}
            >
              CO's
            </Link>
            <Link
              to="/activity"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive('/activity')
                  ? 'bg-purple-500/30 text-white border border-purple-400/50'
                  : 'text-purple-200/70 hover:text-white hover:bg-purple-500/10'
              }`}
            >
              Activity
            </Link>
            <div className="ml-auto">
              <button
                onClick={handleExport}
                className="px-4 py-2 rounded-lg font-medium text-purple-200/70 hover:text-white hover:bg-purple-500/10 transition-all"
              >
                Export Data
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};

