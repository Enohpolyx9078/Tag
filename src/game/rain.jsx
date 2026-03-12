// Made with help from Gemini 3 Pro
import React, { useMemo } from 'react';

export function Rain ({ count = 30 }) {
  const colors = [
    'bg-sky-500', 'bg-sky-600', 'bg-sky-700',
    'bg-sky-800', 'bg-sky-900', 'bg-sky-950'
  ];

  // Generate confetti data once
  const rainDrops = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      color: colors[Math.floor(Math.random() * colors.length)],
      left: `${Math.random() * 100}%`,
      duration: `${Math.random() * 2 + 1}s`,
      delay: `${Math.random() * 5}s`,
      size: Math.random() > 0.5 ? 'w-1 h-1' : 'w-2 h-2', // Randomly small or medium
      wobble: 0
    }));
  }, [count]);

  return (
    <div className="absolute w-full h-[490px] overflow-hidden">
      {rainDrops.map((p) => (
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

export default Rain;