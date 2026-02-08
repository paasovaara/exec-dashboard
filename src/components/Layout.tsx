import { Link, Outlet, useLocation } from 'react-router-dom';

export const Layout = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-black flex flex-col overflow-hidden">
      {/* Navigation Bar */}
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
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};

