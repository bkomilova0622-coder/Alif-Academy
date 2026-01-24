import React, { useState, useEffect } from 'react';
import { ARABIC_ALPHABET, TEAM_COLORS } from '../constants';
import { QuizQuestion, Team, GameMode } from '../types';
import { soundService } from '../services/soundService';

interface GameArenaProps {
  mode: GameMode;
  onClose: () => void;
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

  const initGame = () => {
    const numTeams = mode === 'TEAMS_3' ? 3 : mode === 'TEAMS_2' ? 2 : 1;
    const roundsPerPlayer = 5;
    const totalQuestionsNeeded = numTeams * roundsPerPlayer;

    const initialTeams: Team[] = Array.from({ length: numTeams }, (_, i) => ({
      id: i,
      name: numTeams > 1 ? `Group ${i + 1}` : 'Player 1',
      score: 0,
      color: TEAM_COLORS[i],
    }));
    setTeams(initialTeams);

    // Generate Static Questions locally
    const shuffledAlphabet = [...ARABIC_ALPHABET].sort(() => 0.5 - Math.random());
    const selectedLetters = shuffledAlphabet.slice(0, Math.min(totalQuestionsNeeded, ARABIC_ALPHABET.length));
    
    // If we need more questions than letters, loop back
    const finalSelection = [];
    for(let i = 0; i < totalQuestionsNeeded; i++) {
      finalSelection.push(selectedLetters[i % selectedLetters.length]);
    }

    const staticQuestions: QuizQuestion[] = finalSelection.map(letter => {
      // Pick 3 wrong options
      const wrongOptions = ARABIC_ALPHABET
        .filter(l => l.char !== letter.char)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(l => l.char);
      
      const options = [letter.char, ...wrongOptions].sort(() => 0.5 - Math.random());

      return {
        question: letter.name.toUpperCase(),
        options: options,
        correctAnswer: letter.char,
        letter: letter.name
      };
    });

    setQuestions(staticQuestions);
    setGameState('PLAYING');
  };

  const handlePlaySound = () => {
    if (playingAudio || gameState !== 'PLAYING') return;
    
    setPlayingAudio(true);
    window.speechSynthesis.cancel();
    
    const q = questions[currentQuestionIndex];
    const utterance = new SpeechSynthesisUtterance(`Find the letter ${q.letter}.`);
    
    utterance.lang = 'en-US'; 
    utterance.rate = 0.9;
    
    utterance.onend = () => setPlayingAudio(false);
    utterance.onerror = () => setPlayingAudio(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const handleAnswer = (answer: string) => {
    if (feedback) return;

    const correct = answer === questions[currentQuestionIndex].correctAnswer;
    
    if (correct) {
      soundService.playSuccess();
      setFeedback({ type: 'correct', msg: 'AWESOME! 🌟' });
      const newTeams = [...teams];
      newTeams[currentTeamIndex].score += 10;
      setTeams(newTeams);
    } else {
      soundService.playError();
      setFeedback({ type: 'wrong', msg: `OOPS! 🌈` });
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

  if (gameState === 'LOADING') return null;

  if (gameState === 'FINISHED') {
    const winner = [...teams].sort((a, b) => b.score - a.score)[0];
    const isTie = teams.length > 1 && teams.every(t => t.score === teams[0].score);

    return (
      <div className="flex flex-col items-center justify-center p-12 bg-gradient-to-br from-amber-50 to-orange-100 rounded-[3rem] shadow-2xl min-h-[500px] border-8 border-white text-center">
        <div className="text-8xl mb-6">{isTie ? '🤝' : '🏆'}</div>
        <h2 className="text-5xl font-black text-orange-900 mb-8 uppercase tracking-tighter">
          {isTie ? "It's a Tie!" : `${winner.name} Wins!`}
        </h2>
        <div className="flex flex-wrap justify-center gap-10 mb-10">
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
          FINISH MISSION
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentTeam = teams[currentTeamIndex];

  return (
    <div className="bg-gradient-to-br from-indigo-500 to-sky-600 rounded-[3rem] shadow-2xl overflow-hidden border-8 border-white">
      {/* HUD (Heads Up Display) */}
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
        {/* Cue Card UI */}
        <div className="relative mb-12 group">
          <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full scale-150 animate-pulse"></div>
          <div className="relative w-80 h-48 bg-white rounded-[2.5rem] shadow-2xl border-8 border-white flex flex-col items-center justify-center transform hover:rotate-1 transition-transform">
             <div className={`text-6xl font-black tracking-tighter uppercase mb-2 ${currentTeam.color.replace('bg-', 'text-')}`}>
               {currentQuestion.question}
             </div>
             <button 
               onClick={handlePlaySound}
               disabled={playingAudio}
               className={`mt-2 w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-all shadow-md ${playingAudio ? 'bg-sky-500 text-white animate-pulse' : 'bg-sky-100 text-sky-600 hover:scale-110 active:scale-95'}`}
             >
               {playingAudio ? '🔊' : '🔊'}
             </button>
          </div>
        </div>

        {/* Large Option Buttons */}
        <div className="grid grid-cols-2 gap-6 w-full max-w-lg">
          {currentQuestion.options.map((opt, idx) => (
            <button
              key={idx}
              disabled={!!feedback}
              onClick={() => handleAnswer(opt)}
              className="h-32 text-8xl bg-white rounded-[2.5rem] hover:bg-sky-50 transition-all shadow-xl hover:scale-105 active:scale-95 arabic-text text-sky-900 border-b-8 border-slate-200 flex items-center justify-center"
            >
              {opt}
            </button>
          ))}
        </div>

        {feedback && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-sky-900/40 backdrop-blur-md animate-in fade-in duration-200">
            <div className={`p-14 rounded-[4rem] shadow-2xl scale-110 transition-transform ${feedback.type === 'correct' ? 'bg-emerald-500' : 'bg-rose-500'} text-white text-center border-8 border-white`}>
              <div className="text-9xl mb-4">{feedback.type === 'correct' ? '🌟' : '🍭'}</div>
              <h4 className="text-5xl font-black drop-shadow-md uppercase tracking-tighter">{feedback.msg}</h4>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameArena;