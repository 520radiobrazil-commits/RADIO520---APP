

import React, { useState, useRef, useEffect } from 'react';
import PlayIcon from './icons/PlayIcon';
import PauseIcon from './icons/PauseIcon';
import LoadingSpinner from './LoadingSpinner';
import SoundWave from './SoundWave';

const AUDIO_STREAM_URL = "https://servidor40.brlogic.com:7054/live";

const backgroundImages = [
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop', // DJ Console
  'https://images.unsplash.com/photo-1590602843214-0d38e21247e4?q=80&w=1925&auto=format&fit=crop', // Studio Microphone
  'https://images.unsplash.com/photo-1558296155-26a117a03742?q=80&w=2070&auto=format&fit=crop', // Headphones on mixer
  'https://images.unsplash.com/photo-1551818255-e6e10975846a?q=80&w=1974&auto=format&fit=crop', // Vintage Radio
  'https://images.unsplash.com/photo-1540039155733-5bb30053abbc?q=80&w=1974&auto=format&fit=crop', // Concert Crowd
  'https://images.unsplash.com/photo-1605057116294-015095d338f3?q=80&w=2070&auto=format&fit=crop', // Mixing Board
  'https://images.unsplash.com/photo-1585124039199-a67b588383f2?q=80&w=1935&auto=format&fit=crop'  // Turntable
];

const AudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [shuffledImages, setShuffledImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Effect to shuffle images on mount
  useEffect(() => {
    setShuffledImages([...backgroundImages].sort(() => Math.random() - 0.5));
  }, []);

  // Effect for slideshow timer
  useEffect(() => {
    if (shuffledImages.length === 0) return;

    const timer = setTimeout(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % shuffledImages.length);
    }, 8000); // Change image every 8 seconds

    return () => clearTimeout(timer);
  }, [currentImageIndex, shuffledImages]);

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

  return (
    <div 
        className="relative w-full h-full flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 overflow-hidden bg-black"
    >
        {/* Slideshow Background */}
        <div className="absolute inset-0 z-0">
            {shuffledImages.map((src, index) => (
                <div
                    key={src}
                    className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-[2000ms] ease-in-out ${index === currentImageIndex ? 'kenburns' : ''}`}
                    style={{
                        backgroundImage: `url(${src})`,
                        opacity: index === currentImageIndex ? 1 : 0,
                    }}
                />
            ))}
        </div>
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black bg-opacity-60 z-1"></div>

        {isLoading && <LoadingSpinner />}
        <div className="absolute inset-0 z-5 flex items-center justify-center overflow-hidden opacity-80">
             <SoundWave analyser={analyser} />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(13,2,24,0.1)_0%,rgba(13,2,24,0.8)_80%,#0d0218_100%)] z-10"></div>
        <div className={`relative z-20 flex flex-col items-center justify-center text-center w-full transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
            
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