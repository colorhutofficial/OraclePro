import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Scan, Settings as SettingsIcon, Zap } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navItems = [
    { path: '/', icon: <Home size={20} />, label: 'Dashboard' },
    { path: '/overlay', icon: <Scan size={20} />, label: 'Overlay' },
    { path: '/settings', icon: <SettingsIcon size={20} />, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans flex flex-col overflow-hidden">
      {/* Top Bar - Sticky for native feel */}
      <header className="sticky top-0 z-50 bg-[#09090b]/90 backdrop-blur-xl border-b border-zinc-800 pt-[env(safe-area-inset-top,0px)]">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-600 to-red-600 flex items-center justify-center shadow-lg shadow-orange-900/20">
              <Zap size={18} className="text-white fill-current" />
            </div>
            <h1 className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
              AVIATOR <span className="text-orange-500">ORACLE</span> PRO
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content - Scrollable area */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-6 mb-[80px] md:mb-0 overflow-y-auto no-scrollbar touch-pan-y">
        {children}
      </main>

      {/* Mobile Bottom Navigation (Persistent CTA) */}
      <nav className="fixed bottom-0 left-0 w-full bg-[#18181b]/95 backdrop-blur-lg border-t border-zinc-800 z-50 md:sticky md:bottom-auto md:bg-transparent md:border-t-0 md:hidden pb-safe">
        <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
          {navItems.map((item) => (
            <NavLink 
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex flex-col items-center justify-center w-full h-full space-y-1
                transition-all duration-200
                ${isActive ? 'text-orange-500 scale-105' : 'text-zinc-500 active:text-zinc-300'}
                active:scale-95
              `}
            >
              {({ isActive }) => (
                <>
                <div className="relative">
                    {item.icon}
                    {isActive && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full"></div>}
                </div>
                <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
      
      {/* Desktop Side Nav */}
      <div className="hidden md:flex fixed left-0 top-1/2 -translate-y-1/2 flex-col gap-6 pl-6 z-40">
         {navItems.map((item) => (
            <NavLink 
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                p-3 rounded-xl border transition-all duration-300 group relative
                ${isActive 
                  ? 'bg-orange-500 text-white border-orange-400 shadow-[0_0_20px_rgba(255,106,0,0.4)] scale-110' 
                  : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-600 hover:text-zinc-300'
                }
              `}
            >
              {item.icon}
              <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-zinc-800 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-zinc-700">
                {item.label}
              </span>
            </NavLink>
          ))}
      </div>
    </div>
  );
};

export default Layout;