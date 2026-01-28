
import React, { useMemo, useState } from 'react';
import { RitualEntry } from '../types';

interface PondViewProps {
  entries: RitualEntry[];
  onBegin: () => void;
  onDelete: (id: string) => void;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
}

const LotusFlower: React.FC<{ mood: string }> = ({ mood }) => {
  const flowerColor = "text-pink-100/90";
  const glowColor = "shadow-[0_0_20px_rgba(255,255,255,0.4)]";

  return (
    <div className="relative flex items-center justify-center animate-[sway_4s_ease-in-out_infinite]">
      <span 
        className={`material-symbols-outlined text-6xl ${flowerColor} absolute opacity-40 scale-125 rotate-45`}
        style={{ fontVariationSettings: "'FILL' 1, 'wght' 100" }}
      >
        filter_vintage
      </span>
      <span 
        className={`material-symbols-outlined text-5xl ${flowerColor} absolute opacity-80 rotate-[22deg]`}
        style={{ fontVariationSettings: "'FILL' 1, 'wght' 200" }}
      >
        filter_vintage
      </span>
      <span 
        className={`material-symbols-outlined text-4xl text-white absolute ${glowColor}`}
        style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}
      >
        filter_vintage
      </span>
      <div className="absolute w-2 h-2 bg-yellow-400 rounded-full blur-[1px] opacity-80"></div>
      
      <style>
        {`
          @keyframes sway {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(2px, -3px) rotate(2deg); }
          }
        `}
      </style>
    </div>
  );
};

const PondView: React.FC<PondViewProps> = ({ entries, onBegin, onDelete }) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const lilyPads = useMemo(() => {
    return Array.from({ length: Math.max(7, entries.length) }).map((_, i) => ({
      id: i,
      top: `${10 + Math.random() * 70}%`,
      left: `${10 + Math.random() * 80}%`,
      size: 100 + Math.random() * 100, 
      opacity: i < entries.length ? 1 : 0.4,
      entry: i < entries.length ? entries[i] : null,
      rotation: Math.random() * 360,
    }));
  }, [entries]);

  const handleWaterClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const newRipple = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY,
    };
    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 1500);
  };

  return (
    <div 
      className="relative h-full w-full water-surface overflow-hidden flex flex-col items-center justify-center cursor-crosshair"
      onClick={handleWaterClick}
    >
      <div className="ripple-circle w-[100vw] h-[100vw] opacity-40 animate-pulse"></div>
      <div className="ripple-circle w-[140vw] h-[140vw] opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="ripple-circle w-[180vw] h-[180vw] opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute border border-white/20 rounded-full animate-[ripple_1.5s_ease-out_forwards] pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: 'translate(-50%, -50%)',
            width: '1px',
            height: '1px',
          }}
        />
      ))}

      <style>
        {`
          @keyframes ripple {
            0% { width: 0; height: 0; opacity: 0.8; border-width: 2px; }
            100% { width: 400px; height: 400px; opacity: 0; border-width: 1px; }
          }
        `}
      </style>

      <div className="relative w-full h-full pointer-events-none">
        {lilyPads.map((pad) => (
          <div
            key={pad.id}
            className="absolute flex items-center justify-center transition-all duration-1000"
            style={{ 
              top: pad.top, 
              left: pad.left, 
              opacity: pad.opacity,
              transform: `rotate(${pad.rotation}deg)` 
            }}
          >
            <div 
              className={`victoria-lily-pad pointer-events-auto cursor-pointer
                hover:scale-110 hover:brightness-110 active:scale-95 
                hover:shadow-[inset_0_0_10px_rgba(255,255,255,0.2),0_15px_40px_rgba(0,0,0,0.8)]`}
              style={{ width: pad.size, height: pad.size }}
            >
              <div className="absolute inset-4 border border-white/5 rounded-full pointer-events-none opacity-10"></div>
            </div>
            
            {pad.entry && (
              <div 
                className="absolute z-10 flex flex-col items-center group pointer-events-auto"
                style={{ transform: `rotate(${-pad.rotation}deg)` }}
              >
                <div className="hover:scale-110 transition-transform duration-500 cursor-help">
                  <LotusFlower mood={pad.entry.mood} />
                </div>
                
                <div className="opacity-0 group-hover:opacity-100 absolute top-full mt-6 w-56 p-5 bg-black/85 backdrop-blur-xl rounded-2xl text-white text-[11px] text-center pointer-events-none transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-white/10 z-50">
                   <div className="flex items-center justify-between gap-2 mb-2 border-b border-white/10 pb-2">
                     <div className="flex items-center gap-2">
                       <span className="w-1 h-1 bg-primary rounded-full animate-ping"></span>
                       <p className="font-bold uppercase tracking-[0.25em] text-primary/90 text-[10px]">{pad.entry.mood}</p>
                     </div>
                     <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(pad.entry!.id);
                        }}
                        className="pointer-events-auto p-1 hover:text-red-400 transition-colors"
                     >
                       <span className="material-symbols-outlined text-sm">delete</span>
                     </button>
                   </div>
                   <p className="italic leading-relaxed font-serif text-slate-200">"{pad.entry.summary}"</p>
                   <p className="mt-3 text-[9px] text-slate-500 tracking-widest uppercase">{new Date(pad.entry.date).toLocaleDateString()}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="absolute bottom-28 z-20">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onBegin();
          }}
          className="px-10 py-4 bg-white/5 hover:bg-white/15 text-white rounded-full border border-white/20 backdrop-blur-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3 group shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
        >
          <span className="material-symbols-outlined text-xl group-hover:rotate-12 transition-transform">edit_note</span>
          <span className="tracking-[0.3em] uppercase text-[11px] font-medium">Begin Ritual</span>
        </button>
      </div>
    </div>
  );
};

export default PondView;
