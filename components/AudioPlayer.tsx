
import React, { useState, useRef, useEffect } from 'react';
import PlayIcon from './icons/PlayIcon';
import PauseIcon from './icons/PauseIcon';
import VolumeIcon from './icons/VolumeIcon';
import MuteIcon from './icons/MuteIcon';
import LoadingSpinner from './LoadingSpinner';
import AudioVisualizer from './AudioVisualizer';

const AUDIO_STREAM_URL = "https://servidor40.brlogic.com:7054/live";

const AudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [lastVolume, setLastVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  const setupAudioContext = () => {
    if (audioRef.current && !audioContextRef.current) {
      try {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = context;
        
        const source = context.createMediaElementSource(audioRef.current);
        const newAnalyser = context.createAnalyser();
        
        source.connect(newAnalyser);
        newAnalyser.connect(context.destination);
        
        setAnalyser(newAnalyser);
      } catch (error) {
        console.error("Failed to create AudioContext:", error);
      }
    }
  };

  const togglePlayPause = () => {
    // Create the audio context on the first user interaction (play)
    if (!audioContextRef.current) {
      setupAudioContext();
    }
    
    // Resume context if it was suspended by the browser
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
    }

    if (!isPlaying) {
      setIsLoading(true);
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

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0) {
      setLastVolume(newVolume);
    }
  };

  const toggleMute = () => {
    if (volume > 0) {
      setLastVolume(volume);
      setVolume(0);
    } else {
      setVolume(lastVolume > 0 ? lastVolume : 1);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-black p-4 sm:p-8 lg:p-12 overflow-hidden">
        {isLoading && <LoadingSpinner />}
        <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden filter blur-sm brightness-75">
             <AudioVisualizer analyser={analyser} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-purple-900/60 z-1"></div>
        <div className={`relative z-10 flex flex-col items-center justify-center text-center w-full transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
            
            <div className="flex items-center space-x-2 mb-8">
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <p className="text-red-400 font-semibold tracking-widest">AO VIVO</p>
            </div>
            
            <button
            onClick={togglePlayPause}
            className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg transform transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50"
            aria-label={isPlaying ? 'Pause' : 'Play'}
            >
            {isPlaying ? <PauseIcon className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14" /> : <PlayIcon className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14" />}
            </button>

            {isPlaying && (
              <div className="flex items-center space-x-3 mt-8 w-full max-w-xs">
                <button onClick={toggleMute} aria-label={volume > 0 ? 'Mute' : 'Unmute'}>
                  {volume > 0 ? <VolumeIcon className="w-6 h-6 text-white hover:text-red-400 transition-colors" /> : <MuteIcon className="w-6 h-6 text-white hover:text-red-400 transition-colors" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-600"
                  aria-label="Volume slider"
                />
              </div>
            )}

        </div>
        <audio 
            ref={audioRef} 
            src={AUDIO_STREAM_URL} 
            preload="none" 
            onPlaying={() => setIsLoading(false)}
            onWaiting={() => setIsLoading(true)}
            crossOrigin="anonymous"
        />
    </div>
  );
};

export default AudioPlayer;