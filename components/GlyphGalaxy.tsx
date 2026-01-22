
import React, { useState, useEffect } from 'react';
import { ARABIC_ALPHABET, SIMILARITY_GROUPS, TEAM_COLORS } from '../constants';
import { Team, GameMode } from '../types';

interface GlyphGalaxyProps {
  mode: GameMode;
  onClose: () => void;
}

const GlyphGalaxy: React.FC<GlyphGalaxyProps> = ({ mode, onClose }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [targetLetter, setTargetLetter] = useState<string>('');
  const [options, setOptions] = useState<string[]>([]);
  const [round, setRound] = useState(1);
  const [maxRounds] = useState(10);
  const [gameState, setGameState] = useState<'PLAYING' | 'FINISHED'>('PLAYING');
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong'; msg: string } | null>(null);

  useEffect(() => {
    const numTeams = mode === 'TEAMS_3' ? 3 : mode === 'TEAMS_2' ? 2 : 1;
    setTeams(Array.from({ length: numTeams }, (_, i) => ({
      id: i,
      name: `Group ${i + 1}`,
      score: 0,
      color: TEAM_COLORS[i],
    })));
    generateNewRound();
  }, [mode]);

  const generateNewRound = () => {
    const group = SIMILARITY_GROUPS[Math.floor(Math.random() * SIMILARITY_GROUPS.length)];
    const target = group[Math.floor(Math.random() * group.length)];
    const pool = [...group, ...group, ...group]; 
    while(pool.length < 12) {
      pool.push(ARABIC_ALPHABET[Math.floor(Math.random() * ARABIC_ALPHABET.length)].char);
    }
    setTargetLetter(target);
    setOptions(pool.sort(() => 0.5 - Math.random()));
  };

  const handlePick = (char: string) => {
    if (feedback) return;

    if (char === targetLetter) {
      setFeedback({ type: 'correct', msg: 'SUPER SONIC! 🚀' });
      const newTeams = [...teams];
      newTeams[currentTeamIndex].score += 10;
      setTeams(newTeams);
    } else {
      setFeedback({ type: 'wrong', msg: `BLACK HOLE! 🕳️` });
    }

    setTimeout(() => {
      setFeedback(null);
      if (round < maxRounds) {
        setRound(round + 1);
        setCurrentTeamIndex((currentTeamIndex + 1) % teams.length);
        generateNewRound();
      } else {
        setGameState('FINISHED');
      }
    }, 1200);
  };

  if (gameState === 'FINISHED') {
    const winner = [...teams].sort((a, b) => b.score - a.score)[0];
    return (
      <div className="bg-gradient-to-b from-indigo-900 to-purple-900 p-16 rounded-[4rem] shadow-2xl text-center border-8 border-white/20">
        <h2 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400 mb-10 italic">MISSION CLEAR!</h2>
        <div className="flex justify-center gap-10 mb-12">
          {teams.map(t => (
            <div key={t.id} className="group">
              <div className={`w-32 h-32 rounded-[2rem] ${t.color} flex items-center justify-center text-white text-5xl font-black mb-4 shadow-2xl border-4 border-white/30 group-hover:scale-110 transition-transform`}>
                {t.score}
              </div>
              <p className="text-white font-black uppercase tracking-widest text-sm">{t.name}</p>
            </div>
          ))}
        </div>
        <div className="bg-white/10 p-10 rounded-[3rem] border-4 border-cyan-400/50 mb-12">
          <p className="text-4xl font-black text-cyan-300 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] uppercase tracking-tighter">🏆 {winner.name} Galactic Champion!</p>
        </div>
        <button onClick={onClose} className="px-16 py-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full font-black text-3xl hover:from-cyan-400 hover:to-blue-400 transition-all shadow-2xl shadow-cyan-500/40 hover:scale-105 active:scale-95">
          LAND SHIP
        </button>
      </div>
    );
  }

  const currentTeam = teams[currentTeamIndex] || { name: '...', color: 'bg-slate-800' };

  return (
    <div className="bg-slate-950 rounded-[4rem] shadow-2xl overflow-hidden border-8 border-white/10 relative">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/20 blur-[100px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-600/20 blur-[100px] rounded-full"></div>
      
      <div className="relative p-8 bg-white/5 flex justify-between items-center border-b border-white/10">
        <div className="flex gap-4">
          {teams.map((t, i) => (
            <div key={t.id} className={`px-6 py-3 rounded-2xl transition-all duration-500 ${currentTeamIndex === i ? `${t.color} text-white scale-110 ring-4 ring-white shadow-[0_0_20px_rgba(255,255,255,0.3)]` : 'bg-white/5 text-white/30'}`}>
              <span className="font-black text-xl">{t.score}</span>
              <span className="ml-2 font-bold text-xs uppercase tracking-tighter">{t.name}</span>
            </div>
          ))}
        </div>
        <div className="bg-white/10 px-6 py-3 rounded-full text-cyan-400 font-black text-sm uppercase tracking-widest border border-cyan-400/30">
          STAR {round} / {maxRounds}
        </div>
      </div>

      <div className="relative p-12 flex flex-col items-center">
        <div className="mb-12 text-center">
          <p className="text-cyan-400 font-black uppercase tracking-[0.3em] text-xs mb-6">SCANNING FOR SIGNAL:</p>
          <div className="relative inline-block">
             <div className="absolute inset-0 bg-cyan-500 blur-[40px] opacity-40 animate-pulse"></div>
             <div className="relative w-44 h-44 bg-slate-900/80 rounded-[3rem] border-4 border-cyan-400 flex items-center justify-center text-9xl text-white arabic-text shadow-[inset_0_0_30px_rgba(34,211,238,0.2)]">
               {targetLetter}
             </div>
          </div>
          <p className="mt-8 text-3xl text-white font-black tracking-tighter italic">FIND THE GLYPH!</p>
        </div>

        <div className="grid grid-cols-4 gap-6 w-full max-w-2xl">
          {options.map((char, idx) => (
            <button
              key={idx}
              onClick={() => handlePick(char)}
              disabled={!!feedback}
              className={`h-28 bg-white/5 border-4 border-white/10 rounded-[2rem] flex items-center justify-center text-6xl text-cyan-200 hover:border-cyan-400 hover:bg-white/10 hover:scale-110 active:scale-90 transition-all arabic-text shadow-xl ${feedback ? 'opacity-50' : ''}`}
            >
              {char}
            </button>
          ))}
        </div>
      </div>

      {feedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xl animate-in zoom-in duration-300">
          <div className={`p-20 rounded-[5rem] shadow-[0_0_50px_rgba(255,255,255,0.2)] ${feedback.type === 'correct' ? 'bg-gradient-to-br from-emerald-400 to-cyan-500' : 'bg-gradient-to-br from-pink-500 to-red-600'} text-white text-center border-8 border-white`}>
            <div className="text-[10rem] mb-8 animate-bounce">{feedback.type === 'correct' ? '☄️' : '💥'}</div>
            <h4 className="text-6xl font-black italic tracking-tighter drop-shadow-2xl uppercase">{feedback.msg}</h4>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlyphGalaxy;
