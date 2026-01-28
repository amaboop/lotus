
import React, { useState, useEffect } from 'react';
import { View, RitualEntry } from './types';
import PondView from './components/PondView';
import WriterView from './components/WriterView';
import CalendarView from './components/CalendarView';
import { analyzeReflection } from './services/geminiService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.POND);
  const [entries, setEntries] = useState<RitualEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('lotus_dark_mode');
    return saved ? JSON.parse(saved) : false;
  });

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('lotus_rituals');
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved entries");
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('lotus_rituals', JSON.stringify(entries));
  }, [entries]);

  // Handle Dark Mode Class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    localStorage.setItem('lotus_dark_mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleRelease = async (content: string, seed: string) => {
    setIsProcessing(true);
    const analysis = await analyzeReflection(content);
    
    const newEntry: RitualEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      content,
      summary: analysis.summary,
      mood: analysis.mood,
      seed
    };

    setEntries(prev => [newEntry, ...prev]);
    setIsProcessing(false);
    setCurrentView(View.POND);
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const renderView = () => {
    if (isProcessing) {
      return (
        <div className="h-full w-full flex flex-col items-center justify-center water-surface">
          <span className="text-4xl animate-bounce mb-8">🪷</span>
          <p className="text-xs tracking-[0.4em] uppercase text-white/40 animate-pulse">Releasing to the water...</p>
        </div>
      );
    }

    switch (currentView) {
      case View.POND:
        return <PondView entries={entries} onBegin={() => setCurrentView(View.WRITER)} onDelete={deleteEntry} />;
      case View.WRITER:
        return <WriterView onRelease={handleRelease} onCancel={() => setCurrentView(View.POND)} />;
      case View.CALENDAR:
        return <CalendarView entries={entries} />;
      default:
        return <PondView entries={entries} onBegin={() => setCurrentView(View.WRITER)} onDelete={deleteEntry} />;
    }
  };

  return (
    <div className="h-screen w-full relative flex flex-col">
      <main className="flex-1 relative overflow-hidden">
        {renderView()}
      </main>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/10 dark:bg-black/20 backdrop-blur-xl border-t border-white/10 flex items-center justify-around z-50">
        <button 
          onClick={() => setCurrentView(View.POND)}
          className={`flex flex-col items-center gap-1 transition-colors ${currentView === View.POND ? 'text-primary' : 'text-slate-400'}`}
        >
          <span className="material-symbols-outlined">water</span>
          <span className="text-[8px] uppercase tracking-widest font-bold">Pond</span>
        </button>
        
        <button 
          onClick={() => setCurrentView(View.WRITER)}
          className={`flex flex-col items-center gap-1 transition-colors ${currentView === View.WRITER ? 'text-primary' : 'text-slate-400'}`}
        >
          <span className="material-symbols-outlined">edit_square</span>
          <span className="text-[8px] uppercase tracking-widest font-bold">Reflect</span>
        </button>

        {/* Dark Mode Toggle */}
        <button 
          onClick={toggleDarkMode}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined">
            {isDarkMode ? 'light_mode' : 'dark_mode'}
          </span>
          <span className="text-[8px] uppercase tracking-widest font-bold">{isDarkMode ? 'Light' : 'Dark'}</span>
        </button>

        <button 
          onClick={() => setCurrentView(View.CALENDAR)}
          className={`flex flex-col items-center gap-1 transition-colors ${currentView === View.CALENDAR ? 'text-primary' : 'text-slate-400'}`}
        >
          <span className="material-symbols-outlined">calendar_today</span>
          <span className="text-[8px] uppercase tracking-widest font-bold">Rituals</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
