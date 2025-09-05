import React from 'react';
import { useNotification } from '../context/NotificationContext';
import CheckIcon from './icons/CheckIcon';

const Notification: React.FC = () => {
  const { message, isVisible } = useNotification();

  return (
    <div
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 flex items-center justify-center p-4 rounded-lg shadow-2xl transition-all duration-300 ease-in-out z-50
        bg-gray-800 border border-gray-700 text-white
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5 pointer-events-none'}`}
    >
      <CheckIcon className="w-6 h-6 text-green-400 mr-3" />
      <span className="font-semibold">{message}</span>
    </div>
  );
};

export default Notification;
