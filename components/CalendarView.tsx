
import React from 'react';
import { RitualEntry } from '../types';

interface CalendarViewProps {
  entries: RitualEntry[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ entries }) => {
  const today = new Date();
  const month = today.toLocaleString('default', { month: 'long' });
  const year = today.getFullYear();

  const daysInMonth = new Date(year, today.getMonth() + 1, 0).getDate();
  const firstDay = new Date(year, today.getMonth(), 1).getDay();

  const isRitualDay = (day: number) => {
    return entries.some(e => {
      const d = new Date(e.date);
      return d.getDate() === day && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    });
  };

  return (
    <div className="relative mx-auto flex h-full max-w-[430px] flex-col overflow-hidden bg-background-light dark:bg-background-dark transition-colors duration-500">
      <header className="flex items-center justify-center px-6 pt-24 pb-12">
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-light tracking-[0.2em] uppercase text-slate-800 dark:text-slate-100 transition-colors duration-500">{month}</h2>
          <span className="text-[10px] tracking-[0.3em] font-medium text-slate-400 uppercase">{year}</span>
        </div>
      </header>

      <main className="flex-1 px-4 flex flex-col items-center">
        <div className="w-full max-w-[360px]">
          <div className="grid grid-cols-7 mb-4">
            {['S','M','T','W','T','F','S'].map((day, i) => (
              <p key={i} className="flex h-10 items-center justify-center text-[10px] font-medium tracking-widest text-slate-300 dark:text-slate-600">{day}</p>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-6">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="h-14"></div>
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const hasRitual = isRitualDay(day);
              const isToday = day === today.getDate();

              return (
                <div key={day} className="relative flex flex-col items-center justify-center h-14">
                  <span className={`text-sm font-light transition-colors duration-500 ${isToday ? 'text-primary font-bold' : 'text-slate-600 dark:text-slate-400'}`}>
                    {day}
                  </span>
                  {hasRitual && (
                    <span className="material-symbols-outlined lotus-fill text-[10px] text-primary absolute bottom-0 opacity-80 animate-bounce">
                      filter_vintage
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <div className="h-24"></div>
      <div className="pointer-events-none absolute -left-20 -top-20 size-64 rounded-full bg-primary/5 blur-[100px]"></div>
      <div className="pointer-events-none absolute -right-20 bottom-20 size-64 rounded-full bg-primary/5 blur-[100px]"></div>
    </div>
  );
};

export default CalendarView;
