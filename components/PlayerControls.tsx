
import React from 'react';
import { PlayerMode } from '../types';
import VideoIcon from './icons/VideoIcon';
import HeadphoneIcon from './icons/HeadphoneIcon';

interface PlayerControlsProps {
  activeMode: PlayerMode;
  setMode: (mode: PlayerMode) => void;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({ activeMode, setMode }) => {
  const baseButtonClasses = "flex items-center justify-center space-x-2 px-4 py-2 sm:px-6 sm:py-3 rounded-full text-xs sm:text-sm md:text-base font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900";
  
  const activeAudioButtonClasses = "bg-sky-600 text-white focus:ring-sky-500 shadow-lg shadow-sky-500/50";
  const activeVideoButtonClasses = "bg-red-600 text-white focus:ring-red-500 shadow-lg shadow-red-500/50";
  const inactiveButtonClasses = "bg-gray-700 text-gray-300 hover:bg-gray-600 focus:ring-gray-500";

  return (
    <>
      <button
        onClick={() => setMode(PlayerMode.AUDIO)}
        className={`${baseButtonClasses} ${activeMode === PlayerMode.AUDIO ? activeAudioButtonClasses : inactiveButtonClasses}`}
      >
        <HeadphoneIcon className="w-5 h-5" />
        <span>Ouvir Rádio</span>
      </button>
      <button
        onClick={() => setMode(PlayerMode.VIDEO)}
        className={`${baseButtonClasses} ${activeMode === PlayerMode.VIDEO ? activeVideoButtonClasses : inactiveButtonClasses}`}
      >
        <VideoIcon className="w-5 h-5" />
        <span>Vídeo ao Vivo</span>
      </button>
    </>
  );
};

export default PlayerControls;
