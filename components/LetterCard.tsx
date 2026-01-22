
import React, { useState } from 'react';
import { ColoredArabicLetter } from '../constants';
import { generateMnemonic, generateSpeech } from '../services/geminiService';

interface LetterCardProps {
  letter: ColoredArabicLetter;
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

const LetterCard: React.FC<LetterCardProps> = ({ letter }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [loadingMnemonic, setLoadingMnemonic] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(false);

  const handleMnemonic = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (mnemonic) return;
    setLoadingMnemonic(true);
    try {
      const result = await generateMnemonic(letter.name, letter.char);
      setMnemonic(result);
    } catch (err) {
      setMnemonic("Oops! AI had a nap. Try again.");
    } finally {
      setLoadingMnemonic(false);
    }
  };

  const handlePlaySound = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playingAudio) return;
    setPlayingAudio(true);
    try {
      const prompt = `Say the Arabic letter ${letter.char} also known as ${letter.name}. Then say the word ${letter.exampleWord} which means ${letter.exampleTranslation}.`;
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

  return (
    <div 
      className="relative h-64 w-full cursor-pointer perspective-1000 group"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`relative w-full h-full transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* Front Side */}
        <div className={`absolute inset-0 ${letter.color} rounded-3xl shadow-lg border-4 border-white flex flex-col items-center justify-center p-6 backface-hidden transform group-hover:scale-[1.02] transition-transform`}>
          <button 
            onClick={handlePlaySound}
            disabled={playingAudio}
            className="absolute top-4 right-4 w-12 h-12 bg-white/80 rounded-full flex items-center justify-center text-2xl shadow-sm hover:bg-white hover:scale-110 transition-all"
            title="Hear pronunciation"
          >
            {playingAudio ? (
              <div className="w-5 h-5 border-3 border-sky-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              '🔊'
            )}
          </button>
          <div className={`arabic-text text-8xl ${letter.darkColor} mb-2 drop-shadow-sm`}>{letter.char}</div>
          <div className={`text-2xl font-black ${letter.darkColor}`}>{letter.name}</div>
          <div className="text-sm font-bold opacity-40">/{letter.transliteration}/</div>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 bg-white rounded-3xl shadow-lg border-4 border-sky-200 flex flex-col p-5 rotate-y-180 backface-hidden overflow-hidden">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <img 
                src={letter.exampleImage} 
                alt={letter.exampleTranslation} 
                className="w-20 h-20 rounded-2xl object-cover border-4 border-sky-50 shadow-md" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/200?text=${letter.exampleTranslation}`;
                }}
              />
              <div className="absolute -bottom-2 -right-2 bg-sky-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 border-white">أ</div>
            </div>
            <div>
              <div className="arabic-text text-3xl font-black text-sky-900">{letter.exampleWord}</div>
              <div className="text-md font-bold text-sky-500">{letter.exampleTranslation}</div>
            </div>
          </div>
          
          <div className="flex-1 bg-sky-50/50 rounded-2xl p-4 border-2 border-dashed border-sky-100 mb-2 overflow-y-auto">
             <h4 className="text-[10px] font-black uppercase tracking-widest text-sky-400 mb-2">Memory Magic ✨</h4>
             {mnemonic ? (
               <p className="text-sm text-slate-700 leading-relaxed italic font-medium">"{mnemonic}"</p>
             ) : (
               <button 
                 onClick={handleMnemonic}
                 disabled={loadingMnemonic}
                 className="w-full h-full flex flex-col items-center justify-center gap-2 text-sky-500 hover:text-sky-700 transition-all group/btn"
               >
                 {loadingMnemonic ? (
                   <div className="w-6 h-6 border-3 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                 ) : (
                   <>
                     <span className="text-3xl group-hover/btn:rotate-12 transition-transform">🤖</span>
                     <span className="text-xs font-black uppercase tracking-tighter">AI Teacher Trick</span>
                   </>
                 )}
               </button>
             )}
          </div>
          <p className="text-[10px] text-center text-slate-300 font-black uppercase tracking-widest">Tap to flip</p>
        </div>
      </div>
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};

export default LetterCard;
