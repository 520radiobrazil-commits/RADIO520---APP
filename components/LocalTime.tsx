import React, { useState, useEffect } from 'react';
import ClockIcon from './icons/ClockIcon';

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

  const dayOfWeek = time.toLocaleDateString('pt-BR', { weekday: 'long' }).split('-')[0];
  const formattedDay = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
  const isSunday = formattedDay === 'Domingo';

  const formattedTime = time.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const fullDateTimeString = `${formattedDay} ${formattedTime}`;

  return (
    <div
      className="flex items-center space-x-2 cursor-default"
      aria-live="off"
      aria-label={`Hora local atual: ${fullDateTimeString}`}
      title="Hora local"
    >
      <ClockIcon className="w-4 h-4 text-cyan-300" />
      <span className="font-mono text-xs font-medium">
        <span className={isSunday ? 'text-red-400' : 'text-white'}>
          {formattedDay}
        </span>
        <span className="text-white"> {formattedTime}</span>
      </span>
    </div>
  );
};

export default LocalTime;