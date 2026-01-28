
import React, { useState, useEffect } from 'react';

interface TimerViewProps {
  onComplete: () => void;
}

const TimerView: React.FC<TimerViewProps> = ({ onComplete }) => {
  const [seconds, setSeconds] = useState(300); // 5 minutes default
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(s => s - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      onComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, onComplete]);

  const toggle = () => setIsActive(!isActive);

  // Rotate logic: 360 degrees / 300 seconds
  const rotation = (seconds / 300) * 360;

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-sand-surface overflow-hidden">
      <div className="relative flex items-center justify-center w-full h-full">
        <div className="w-[320px] h-[320px] bg-white rounded-full flex flex-col items-center justify-center shadow-xl relative overflow-hidden">
          {/* Progress Circle Visual */}
          <div 
            className="absolute inset-0 bg-primary/5 transition-all duration-1000 origin-center"
            style={{ transform: `rotate(${rotation}deg)` }}
          ></div>

          <div className="z-10 flex flex-col items-center">
            <span className="text-4xl font-light tracking-widest text-slate-800 mb-2">{formatTime(seconds)}</span>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Ritual Focus</p>
          </div>

          {/* Minimalist Pointer */}
          <div 
            className="pointer-container transition-transform duration-1000"
            style={{ transform: `rotate(${rotation}deg)`, position: 'absolute', height: '90%', width: '1.5px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
          >
            <div className="w-full h-full bg-[#333] rounded-full opacity-20"></div>
            <div className="absolute w-[6px] h-[6px] bg-[#333] rounded-full z-10"></div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-16 flex gap-4">
         <button 
          onClick={toggle}
          className="px-8 py-3 bg-slate-800 text-white rounded-full hover:bg-slate-700 transition-all active:scale-95 text-xs uppercase tracking-widest font-light shadow-lg"
        >
          {isActive ? 'Pause' : 'Resume'}
        </button>
      </div>
    </div>
  );
};

export default TimerView;
