import React, { createContext, useState, useContext, ReactNode } from 'react';

interface NotificationContextType {
  showNotification: (message: string) => void;
  message: string;
  isVisible: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  const showNotification = (newMessage: string) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setMessage(newMessage);
    setIsVisible(true);

    const id = window.setTimeout(() => {
      setIsVisible(false);
      setTimeoutId(null);
    }, 3000);
    setTimeoutId(id);
  };

  return (
    <NotificationContext.Provider value={{ showNotification, message, isVisible }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
