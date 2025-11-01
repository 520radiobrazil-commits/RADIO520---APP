import React, { useState, useRef, useEffect } from 'react';
import PlayIcon from './icons/PlayIcon';
import PauseIcon from './icons/PauseIcon';
import LoadingSpinner from './LoadingSpinner';
import InfoBar from './InfoBar';
import NewsTicker from './NewsTicker';

const AUDIO_STREAM_URL = "https://servidor40.brlogic.com:7054/live";
const BACKGROUND_IMAGE_URL = "https://public-rf-upload.minhawebradio.net/249695/ad/e43dfc75b170b1d37316dc0dd84d50d1.png";

// Add gtag declaration for TypeScript
declare global {
  interface Window {
    gtag?: (command: string, action: string, params?: { [key: string]: any }) => void;
  }
}

const AudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const togglePlayPause = () => {
    if (!audioRef.current?.src) {
        if (audioRef.current) {
            audioRef.current.src = AUDIO_STREAM_URL;
            audioRef.current.load();
        }
    }
    if (!isPlaying) {
      setIsLoading(true);
      // Send play event to Google Analytics
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'play', { source: 'Radio520Player' });
      }
    } else {
      // Send pause event to Google Analytics
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'pause', { source: 'Radio520Player' });
      }
    }
    setIsPlaying(prev => !prev);
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Audio play failed:", error);
          setIsPlaying(false);
          setIsLoading(false);
        });
      } else {
        audioRef.current.pause();
        setIsLoading(false);
      }
    }
  }, [isPlaying]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-black flex items-center justify-center">
        <div
            className="absolute inset-0 z-0 w-full h-full bg-cover bg-center kenburns"
            style={{
                backgroundImage: `url(${BACKGROUND_IMAGE_URL})`,
                animationPlayState: isPlaying ? 'running' : 'paused'
            }}
        />

        <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
        
        <div className={`absolute inset-0 z-30 transition-opacity duration-500 ease-in-out ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <LoadingSpinner />
        </div>
        
        <div className={`absolute inset-0 z-20 flex flex-col h-full transition-opacity duration-500 ease-in-out ${!isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="flex-shrink-0">
                <NewsTicker />
            </div>
            
            <div className="relative flex-grow flex items-center justify-center p-4">
              <button
                onClick={togglePlayPause}
                className="relative z-30 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-orange-600/50 backdrop-blur-sm text-white flex items-center justify-center shadow-lg transform transition-all duration-300 hover:scale-110 hover:bg-orange-500/70 focus:outline-none focus:ring-4 focus:ring-orange-500/50"
                aria-label={isPlaying ? 'Pausar' : 'Tocar'}
              >
                {!isPlaying && (
                  <span className="absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75 animate-ping"></span>
                )}
                <span className="relative z-10">
                  {isPlaying ? <PauseIcon className="w-6 h-6 sm:w-8 sm:h-8" /> : <PlayIcon className="w-6 h-6 sm:w-8 sm:h-8" />}
                </span>
              </button>
            </div>

            <div className="flex-shrink-0">
                <InfoBar />
            </div>
        </div>
        
        <audio 
            ref={audioRef} 
            src={AUDIO_STREAM_URL} 
            preload="none" 
            onPlaying={() => setIsLoading(false)}
            onWaiting={() => setIsLoading(true)}
            onError={() => {
              setIsLoading(false);
              setIsPlaying(false);
              console.error("Error with audio stream.");
            }}
        />
    </div>
  );
};

export default AudioPlayer;