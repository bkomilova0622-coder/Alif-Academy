
import React, { useState } from 'react';
import Layout from './components/Layout';
import LetterCard from './components/LetterCard';
import GameArena from './components/GameArena';
import GlyphGalaxy from './components/GlyphGalaxy';
import { ARABIC_ALPHABET } from './constants';
import { GameMode, GameType } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'lessons' | 'games'>('home');
  const [activeGame, setActiveGame] = useState<{ type: GameType; mode: GameMode } | null>(null);

  const renderContent = () => {
    if (activeGame) {
      return (
        <div className="max-w-4xl mx-auto py-8">
           <button 
             onClick={() => setActiveGame(null)}
             className="mb-8 px-6 py-2 bg-white text-sky-600 rounded-full shadow-md hover:shadow-lg font-black uppercase tracking-widest text-xs flex items-center gap-2 transition-all hover:-translate-x-1"
           >
             ← QUIT MISSION
           </button>
           {activeGame.type === 'QUIZ' ? (
             <GameArena mode={activeGame.mode} onClose={() => setActiveGame(null)} />
           ) : (
             <GlyphGalaxy mode={activeGame.mode} onClose={() => setActiveGame(null)} />
           )}
        </div>
      );
    }

    switch (view) {
      case 'home':
        return (
          <div className="py-12 flex flex-col items-center">
            <div className="text-center mb-20 max-w-3xl">
              <span className="px-6 py-2 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-full text-xs font-black uppercase tracking-[0.3em] mb-10 shadow-lg inline-block animate-pulse">ARABIC ADVENTURE</span>
              <h2 className="text-6xl md:text-8xl font-black text-sky-900 mb-8 leading-[0.9] tracking-tighter drop-shadow-sm">Alif Academy <span className="text-sky-400">Kids!</span></h2>
              <p className="text-2xl text-slate-500 font-bold leading-relaxed max-w-2xl mx-auto">The most colorful way to learn Arabic. Lessons, AI magic, and team battles await!</p>
            </div>

            <div className="grid md:grid-cols-2 gap-10 w-full max-w-5xl">
              <div 
                onClick={() => setView('lessons')}
                className="group relative p-10 bg-gradient-to-br from-sky-400 to-blue-600 rounded-[3rem] shadow-2xl border-8 border-white transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center text-6xl mb-8 group-hover:rotate-12 transition-transform shadow-xl">
                  📚
                </div>
                <h3 className="text-4xl font-black text-white mb-4">Letter Labs</h3>
                <p className="text-sky-100 text-lg font-bold">Interactive flashcards with AI tricks!</p>
                <div className="absolute top-8 right-8 text-white/20 text-8xl font-black arabic-text">أ</div>
              </div>

              <div 
                onClick={() => setView('games')}
                className="group relative p-10 bg-gradient-to-br from-pink-400 to-rose-600 rounded-[3rem] shadow-2xl border-8 border-white transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center text-6xl mb-8 group-hover:rotate-12 transition-transform shadow-xl">
                  🎮
                </div>
                <h3 className="text-4xl font-black text-white mb-4">Team Arena</h3>
                <p className="text-pink-100 text-lg font-bold">Challenge friends in epic battles!</p>
                <div className="absolute top-8 right-8 text-white/20 text-8xl font-black arabic-text">ج</div>
              </div>
            </div>
          </div>
        );

      case 'lessons':
        return (
          <div className="py-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 px-4">
              <div>
                <h2 className="text-6xl font-black text-sky-900 tracking-tighter mb-4">Letter Labs</h2>
                <p className="text-xl text-slate-400 font-bold uppercase tracking-widest italic">Tap to flip & hear AI secrets!</p>
              </div>
              <div className="flex gap-4">
                <span className="px-6 py-3 bg-sky-100 text-sky-600 rounded-2xl text-sm font-black uppercase tracking-widest shadow-sm">28 Glyphs</span>
                <span className="px-6 py-3 bg-amber-100 text-amber-600 rounded-2xl text-sm font-black uppercase tracking-widest shadow-sm">Super Fun</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {ARABIC_ALPHABET.map((letter, idx) => (
                <LetterCard key={idx} letter={letter} />
              ))}
            </div>
          </div>
        );

      case 'games':
        return (
          <div className="py-12 px-4">
            <div className="text-center mb-20">
              <h2 className="text-6xl font-black text-sky-900 tracking-tighter mb-6">Battle Grounds</h2>
              <p className="text-2xl text-slate-500 font-bold max-w-2xl mx-auto">Pick a mission and team up for victory!</p>
            </div>

            <div className="space-y-20 max-w-6xl mx-auto">
              <div>
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-14 h-14 bg-indigo-500 rounded-2xl flex items-center justify-center text-3xl shadow-xl ring-4 ring-white">🚀</div>
                  <h3 className="text-4xl font-black text-slate-800 tracking-tighter uppercase italic underline decoration-sky-400 underline-offset-8">Glyph Galaxy</h3>
                </div>
                <div className="grid sm:grid-cols-3 gap-10">
                  <GameCard title="Lone Ranger" icon="👩‍🚀" color="sky" desc="Visual Match Practice" onClick={() => setActiveGame({ type: 'GLYPH_GALAXY', mode: 'SOLO' })} />
                  <GameCard title="Duo Duel" icon="👯‍♂️" color="pink" desc="2-Group Team Battle" onClick={() => setActiveGame({ type: 'GLYPH_GALAXY', mode: 'TEAMS_2' })} />
                  <GameCard title="Triple Threat" icon="👪" color="emerald" desc="3-Group Chaos Mode" onClick={() => setActiveGame({ type: 'GLYPH_GALAXY', mode: 'TEAMS_3' })} />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-3xl shadow-xl ring-4 ring-white">🧠</div>
                  <h3 className="text-4xl font-black text-slate-800 tracking-tighter uppercase italic underline decoration-amber-400 underline-offset-8">Brain Battle</h3>
                </div>
                <div className="grid sm:grid-cols-3 gap-10">
                  <GameCard title="IQ Training" icon="🏋️" color="sky" desc="Solo Letter Quiz" onClick={() => setActiveGame({ type: 'QUIZ', mode: 'SOLO' })} />
                  <GameCard title="Group Rumble" icon="⚔️" color="pink" desc="2-Group Knowledge War" onClick={() => setActiveGame({ type: 'QUIZ', mode: 'TEAMS_2' })} />
                  <GameCard title="Battle Royale" icon="👑" color="emerald" desc="3-Group Free For All" onClick={() => setActiveGame({ type: 'QUIZ', mode: 'TEAMS_3' })} />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout currentView={view} onNavigate={(v: any) => setView(v)}>
      {renderContent()}
    </Layout>
  );
};

const GameCard: React.FC<{ title: string; icon: string; color: string; desc: string; onClick: () => void }> = ({ title, icon, color, desc, onClick }) => {
  const colorMap: Record<string, string> = {
    sky: 'bg-gradient-to-br from-sky-400 to-blue-500 text-white',
    pink: 'bg-gradient-to-br from-pink-400 to-rose-500 text-white',
    emerald: 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white',
  };

  return (
    <div 
      onClick={onClick}
      className={`group flex flex-col items-center p-10 rounded-[3rem] shadow-2xl border-8 border-white transition-all cursor-pointer hover:scale-105 active:scale-95 ${colorMap[color]}`}
    >
      <div className="text-7xl mb-8 group-hover:scale-125 transition-transform drop-shadow-lg">{icon}</div>
      <h4 className="text-2xl font-black tracking-tight uppercase mb-2">{title}</h4>
      <p className="text-sm font-bold opacity-80 mb-8">{desc}</p>
      <button className="px-10 py-3 bg-white text-slate-900 rounded-full font-black uppercase tracking-widest text-xs shadow-lg group-hover:bg-slate-900 group-hover:text-white transition-all">
        START MISSION
      </button>
    </div>
  );
};

export default App;
