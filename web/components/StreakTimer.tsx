'use client';

import { useEffect, useState } from 'react';

interface StreakTimerProps {
  streakDays: number;
}

export function StreakTimer({ streakDays }: StreakTimerProps) {
  const [elapsed, setElapsed] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Calculate time elapsed since last streak day
    const calculateElapsed = () => {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const diff = now.getTime() - startOfDay.getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setElapsed({ hours, minutes, seconds });
    };

    calculateElapsed();
    const interval = setInterval(calculateElapsed, 1000);

    return () => clearInterval(interval);
  }, [streakDays]);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="text-center">
      <div className="text-5xl font-black font-mono mb-2">
        {streakDays}
        <span className="text-lg text-zinc-400 ml-2">Days</span>
      </div>
      <div className="text-sm font-medium text-zinc-500">
        + {formatNumber(elapsed.hours)}:{formatNumber(elapsed.minutes)}:{formatNumber(elapsed.seconds)} today
      </div>
    </div>
  );
}
