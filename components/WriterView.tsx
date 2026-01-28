
import React, { useState, useEffect } from 'react';
import { getDailySeed } from '../services/geminiService';
import { SeedResponse } from '../types';

interface WriterViewProps {
  onRelease: (content: string, seed: string) => void;
  onCancel: () => void;
}

const WriterView: React.FC<WriterViewProps> = ({ onRelease, onCancel }) => {
  const [content, setContent] = useState('');
  const [seed, setSeed] = useState<SeedResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeed = async () => {
      setLoading(true);
      const data = await getDailySeed();
      setSeed(data);
      setLoading(false);
    };
    fetchSeed();
  }, []);

  const handleRelease = () => {
    if (content.trim().length < 5) return;
    onRelease(content, seed?.prompt || '');
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-background-light dark:bg-background-dark">
      <header className="px-8 pt-12 pb-6 flex justify-between items-center">
        <button 
          onClick={onCancel}
          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        {seed && (
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] text-primary/60 mb-1">{seed.theme}</p>
            <h2 className="text-xs font-light text-slate-400 max-w-xs mx-auto italic leading-relaxed">
              "{seed.prompt}"
            </h2>
          </div>
        )}
        <div className="w-10"></div>
      </header>

      <main className="flex-1 flex flex-col items-center px-6 pb-6 overflow-hidden">
        <div className="w-full max-w-md h-full bg-white dark:bg-slate-800/40 rounded-3xl shadow-[0_10px_50px_-12px_rgba(0,0,0,0.03)] flex flex-col relative overflow-hidden transition-all duration-300 border border-white/50 dark:border-slate-700/30">
          <div className="flex-1 w-full flex flex-col p-8 md:p-12">
            <textarea 
              autoFocus
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="form-input flex-1 w-full resize-none overflow-y-auto rounded-none border-none bg-transparent p-0 text-[#2c3e50] dark:text-slate-200 placeholder:text-[#cbd5e1] dark:placeholder:text-slate-700 focus:ring-0 text-xl md:text-2xl font-light leading-relaxed tracking-wide italic font-serif" 
              placeholder={loading ? "Waiting for the seed..." : "Let the words flow..."}
              disabled={loading}
            />
          </div>
        </div>
      </main>

      <footer className="flex flex-col items-center justify-end pb-12 pt-4">
        <div className="flex px-4 py-3 justify-center w-full">
          <button 
            onClick={handleRelease}
            disabled={content.trim().length < 10}
            className={`flex size-16 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm transition-all border border-[#e2e8f0]/60 dark:border-slate-700 active:scale-95 ${content.trim().length < 10 ? 'opacity-30 grayscale' : 'hover:shadow-md hover:bg-white hover:scale-105'}`}
          >
            <span className="text-3xl leading-none">🪷</span>
          </button>
        </div>
        <p className={`text-[10px] uppercase tracking-widest mt-2 transition-opacity ${content.trim().length > 0 ? 'opacity-40' : 'opacity-0'}`}>
          Release to the Pond
        </p>
      </footer>

      <div className="absolute -z-10 top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]"></div>
      <div className="absolute -z-10 bottom-[-5%] right-[-5%] w-[30%] h-[30%] rounded-full bg-primary/5 blur-[100px]"></div>
    </div>
  );
};

export default WriterView;
