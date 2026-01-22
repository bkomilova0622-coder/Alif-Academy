import React, { useState, useEffect } from 'react';
import { ARABIC_ALPHABET, TEAM_COLORS } from '../constants';
import { generateQuizQuestions, generateSpeech } from '../services/geminiService';
import { QuizQuestion, Team, GameMode } from '../types';

interface GameArenaProps {
  mode: GameMode;
  onClose: () => void;
}

// Utility functions for audio decoding
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const GameArena: React.FC<GameArenaProps> = ({ mode, onClose }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [gameState, setGameState] = useState<'LOADING' | 'PLAYING' | 'FINISHED'>('LOADING');
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong'; msg: string } | null>(null);
  const [playingAudio, setPlayingAudio] = useState(false);

  useEffect(() => {
    initGame();
  }, [mode]);

  const initGame = async () => {
    const numTeams = mode === 'TEAMS_3' ? 3 : mode === 'TEAMS_2' ? 2 : 1;
    const initialTeams: Team[] = Array.from({ length: numTeams }, (_, i) => ({
      id: i,
      name: `Team ${String.fromCharCode(65 + i)}`,
      score: 0,
      color: TEAM_COLORS[i],
    }));
    setTeams(initialTeams);

    const shuffled = [...ARABIC_ALPHABET].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10).map(l => l.name);
    
    try {
      const fetchedQuestions = await generateQuizQuestions(selected);
      setQuestions(fetchedQuestions);
      setGameState('PLAYING');
    } catch (err) {
      setQuestions([
        { question: "ALIF", options: ["أ", "ب", "ت", "ث"], correctAnswer: "أ", letter: "Alif" },
        { question: "BA", options: ["ج", "ب", "ح", "خ"], correctAnswer: "ب", letter: "Ba" }
      ]);
      setGameState('PLAYING');
    }
  };

  const handlePlaySound = async () => {
    if (playingAudio || gameState !== 'PLAYING') return;
    setPlayingAudio(true);
    try {
      const q = questions[currentQuestionIndex];
      const prompt = `Point to the letter ${q.letter}.`;
      const base64Audio = await generateSpeech(prompt);
      
      if (base64Audio) {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const audioBytes = decodeBase64(base64Audio);
        const audioBuffer = await decodeAudioData(audioBytes, audioCtx, 24000, 1);
        
        const source = audioCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioCtx.destination);
        source.onended = () => setPlayingAudio(false);
        source.start();
      } else {
        setPlayingAudio(false);
      }
    } catch (err) {
      console.error("Audio error:", err);
      setPlayingAudio(false);
    }
  };

  const handleAnswer = (answer: string) => {
    if (feedback) return;

    const correct = answer === questions[currentQuestionIndex].correctAnswer;
    
    if (correct) {
      setFeedback({ type: 'correct', msg: 'AWESOME! ✨' });
      const newTeams = [...teams];
      newTeams[currentTeamIndex].score += 10;
      setTeams(newTeams);
    } else {
      setFeedback({ type: 'wrong', msg: `TRY AGAIN! 🌈` });
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setCurrentTeamIndex((currentTeamIndex + 1) % teams.length);
      } else {
        setGameState('FINISHED');
      }
    }, 1500);
  };

  if (gameState === 'LOADING') {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-[3rem] shadow-2xl min-h-[500px] border-8 border-sky-100">
        <div className="relative mb-8">
          <div className="w-24 h-24 border-8 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-4xl">🧠</div>
        </div>
        <p className="text-3xl font-black text-sky-900 animate-bounce uppercase tracking-tighter">Preparing Mission...</p>
      </div>
    );
  }

  if (gameState === 'FINISHED') {
    const winner = [...teams].sort((a, b) => b.score - a.score)[0];
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-gradient-to-br from-amber-50 to-orange-100 rounded-[3rem] shadow-2xl min-h-[500px] border-8 border-white">
        <div className="text-8xl mb-6">🥇</div>
        <h2 className="text-5xl font-black text-orange-900 mb-8 uppercase tracking-tighter">{winner.name} Wins!</h2>
        <div className="flex gap-10 mb-10">
          {teams.map(t => (
            <div key={t.id} className="text-center">
              <div className={`w-24 h-24 rounded-3xl ${t.color} flex items-center justify-center text-white text-4xl font-black shadow-xl border-4 border-white mb-3`}>
                {t.score}
              </div>
              <p className="font-black text-slate-800 uppercase tracking-widest text-sm">{t.name}</p>
            </div>
          ))}
        </div>
        <button 
          onClick={onClose}
          className="px-12 py-5 bg-orange-500 text-white rounded-full font-black text-2xl hover:bg-orange-600 transition-all shadow-xl hover:scale-105"
        >
          GREAT JOB!
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentTeam = teams[currentTeamIndex];

  return (
    <div className="bg-gradient-to-br from-indigo-500 to-sky-600 rounded-[3rem] shadow-2xl overflow-hidden border-8 border-white">
      {/* HUD */}
      <div className="bg-white/10 p-6 flex items-center justify-between border-b border-white/20">
        <div className="flex gap-4">
          {teams.map((t, i) => (
            <div key={t.id} className={`flex items-center gap-3 px-5 py-2 rounded-2xl border-4 transition-all duration-500 ${currentTeamIndex === i ? `${t.color} border-white text-white scale-110 shadow-xl` : 'bg-black/20 border-transparent text-white/50'}`}>
               <span className="font-black text-lg">{t.score}</span>
               <span className="font-bold text-[10px] uppercase tracking-tighter">{t.name}</span>
            </div>
          ))}
        </div>
        <div className="bg-white/20 px-4 py-2 rounded-full text-white font-black text-xs uppercase tracking-widest">
          {currentQuestionIndex + 1} / {questions.length}
        </div>
      </div>

      <div className="p-10 flex flex-col items-center">
        {/* Cue Card */}
        <div className="relative mb-12 group">
          <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full scale-150 animate-pulse"></div>
          <div className="relative w-72 h-44 bg-white rounded-[2.5rem] shadow-2xl border-8 border-white flex flex-col items-center justify-center transform hover:rotate-2 transition-transform">
             <div className={`text-6xl font-black tracking-tighter uppercase mb-2 ${currentTeam.color.replace('bg-', 'text-')}`}>
               {currentQuestion.question}
             </div>
             <button 
               onClick={handlePlaySound}
               disabled={playingAudio}
               className="mt-2 w-14 h-14 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center text-2xl hover:scale-110 active:scale-95 transition-all shadow-md"
             >
               {playingAudio ? '⏳' : '🔊'}
             </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 w-full max-w-lg">
          {currentQuestion.options.map((opt, idx) => (
            <button
              key={idx}
              disabled={!!feedback}
              onClick={() => handleAnswer(opt)}
              className="h-32 text-7xl bg-white rounded-[2rem] hover:bg-sky-50 transition-all shadow-xl hover:scale-105 active:scale-95 arabic-text text-sky-900 border-b-8 border-slate-200 flex items-center justify-center"
            >
              {opt}
            </button>
          ))}
        </div>

        {feedback && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-sky-900/30 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={`p-12 rounded-[3.5rem] shadow-2xl scale-110 transition-transform ${feedback.type === 'correct' ? 'bg-emerald-500' : 'bg-pink-500'} text-white text-center border-8 border-white`}>
              <div className="text-8xl mb-4">{feedback.type === 'correct' ? '🎈' : '🍭'}</div>
              <h4 className="text-4xl font-black drop-shadow-md uppercase tracking-tighter">{feedback.msg}</h4>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameArena;