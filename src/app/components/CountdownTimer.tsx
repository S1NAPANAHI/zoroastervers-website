'use client';

import { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer() {
  // Set the next issue date (3 months from now - adjust this date as needed)
  const nextIssueDate = new Date('2025-10-27T00:00:00'); // Example: October 27, 2025
  
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const targetTime = nextIssueDate.getTime();
      const difference = targetTime - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
        setIsExpired(false);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsExpired(true);
      }
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [nextIssueDate]);

  if (isExpired) {
    return (
      <div className="fixed top-[100px] left-0 right-0 z-30 w-full bg-gradient-to-r from-emerald-600 to-green-500 shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center space-x-3">
            <span className="text-lg">🎉</span>
            <span className="text-white font-medium">
              New ZOROASTER Issue Available Now!
            </span>
            <span className="text-lg">🎉</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-[100px] left-0 right-0 z-30 w-full bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="text-white/80 text-sm font-medium">Next ZOROASTER Issue:</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-white font-bold text-lg">{timeLeft.days.toString().padStart(2, '0')}</div>
              <div className="text-white/70 text-xs uppercase tracking-wide">Days</div>
            </div>
            <div className="text-white/50">:</div>
            <div className="text-center">
              <div className="text-white font-bold text-lg">{timeLeft.hours.toString().padStart(2, '0')}</div>
              <div className="text-white/70 text-xs uppercase tracking-wide">Hours</div>
            </div>
            <div className="text-white/50">:</div>
            <div className="text-center">
              <div className="text-white font-bold text-lg">{timeLeft.minutes.toString().padStart(2, '0')}</div>
              <div className="text-white/70 text-xs uppercase tracking-wide">Min</div>
            </div>
            <div className="text-white/50">:</div>
            <div className="text-center">
              <div className="text-white font-bold text-lg">{timeLeft.seconds.toString().padStart(2, '0')}</div>
              <div className="text-white/70 text-xs uppercase tracking-wide">Sec</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
