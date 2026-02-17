// Made with help from Gemini 3 Pro
import React, { useMemo } from 'react';

export function ConfettiRain ({ count = 100 }) {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 
    'bg-yellow-400', 'bg-purple-500', 'bg-pink-500', 
    'bg-orange-500', 'bg-teal-400'
  ];

  // Generate confetti data once
  const confettiPieces = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      color: colors[Math.floor(Math.random() * colors.length)],
      left: `${Math.random() * 100}%`,
      duration: `${Math.random() * 3 + 2}s`,
      delay: `${Math.random() * 5}s`,
      size: Math.random() > 0.5 ? 'w-2 h-2' : 'w-3 h-3', // Randomly small or medium
      wobble: Math.floor(Math.random() * 10) + 5
    }));
  }, [count]);

  return (
    <div className="relative w-full h-[490px] overflow-hidden">
      {confettiPieces.map((p) => (
        <div
          key={p.id}
          className={`absolute top-0 opacity-0 animate-fall ${p.color} ${p.size}`}
          style={{
            '--wobble' : `${p.wobble}px`,
            '--wobble-neg' : `-${p.wobble}px`,
            left: p.left,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
};

export default ConfettiRain;