import React, { useState, useEffect } from 'react';

const LocalTime: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className="flex items-center space-x-2 px-3 py-1.5 cursor-default"
      aria-live="off"
      aria-label={`Hora local atual: ${formatTime(time)}`}
      title="Hora local"
    >
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
      </span>
      <span className="font-mono text-xs sm:text-sm font-semibold text-white tracking-wider text-glow-cyan">
        {formatTime(time)}
      </span>
    </div>
  );
};

export default LocalTime;
