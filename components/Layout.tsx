
import React from 'react';

const Layout: React.FC<{ children: React.ReactNode; currentView: string; onNavigate: (view: string) => void }> = ({ children, currentView, onNavigate }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-sky-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onNavigate('home')}
          >
            <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold group-hover:rotate-12 transition-transform">
              أ
            </div>
            <h1 className="text-2xl font-bold text-sky-800 tracking-tight">Alif Academy</h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => onNavigate('lessons')}
              className={`font-semibold transition-colors ${currentView === 'lessons' ? 'text-sky-600' : 'text-slate-500 hover:text-sky-50'}`}
            >
              Lessons
            </button>
            <button 
              onClick={() => onNavigate('games')}
              className={`font-semibold transition-colors ${currentView === 'games' ? 'text-sky-600' : 'text-slate-500 hover:text-sky-50'}`}
            >
              Games
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-1 bg-amber-100 text-amber-700 rounded-full uppercase">Alpha v1.0</span>
          </div>
        </div>
      </header>
      
      <main className="flex-1 max-w-6xl w-full mx-auto p-4">
        {children}
      </main>

      <footer className="p-10 text-center bg-white/50 border-t border-sky-100">
        <div className="flex flex-col items-center gap-3">
          <div className="text-slate-500 font-bold text-sm tracking-tight">
            &copy; 2026 Alif Academy • Made with ❤️ for beginners
          </div>
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-md border-2 border-white">
            Created by Bibihadicha
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
