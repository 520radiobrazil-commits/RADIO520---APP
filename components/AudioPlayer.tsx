

import React, { useState, useRef, useEffect } from 'react';
import PlayIcon from './icons/PlayIcon';
import PauseIcon from './icons/PauseIcon';
import LoadingSpinner from './LoadingSpinner';

const AUDIO_STREAM_URL = "https://servidor40.brlogic.com:7054/live";
const LOGO_URL = "https://public-rf-upload.minhawebradio.net/249695/ad/e4afe65bc29bd449a81737943a4e4091.png";

const backgroundImages = [
  'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', // Concert Crowd
  'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', // Stage Lights
  'https://images.pexels.com/photos/374631/pexels-photo-374631.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', // Headphones
  'https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', // Music Festival
  'https://images.pexels.com/photos/995301/pexels-photo-995301.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', // DJ Mixer
  'https://images.pexels.com/photos/210922/pexels-photo-210922.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', // Electric Guitar
  'https://images.pexels.com/photos/3359734/pexels-photo-3359734.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'  // Vintage Radio
];


const AudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [imagePool, setImagePool] = useState<string[]>([]);
  const [targetImageIndex, setTargetImageIndex] = useState(0); 
  const [visibleImageIndex, setVisibleImageIndex] = useState(0); 
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    setImagePool(backgroundImages);
    if (backgroundImages.length > 0) {
        const initialIndex = Math.floor(Math.random() * backgroundImages.length);
        setTargetImageIndex(initialIndex);
    }
  }, []);
  
  useEffect(() => {
    if (imagePool.length === 0) return;

    const currentImageSrc = imagePool[targetImageIndex];
    if (currentImageSrc && !loadedImages.has(currentImageSrc)) {
      const img = new Image();
      img.src = currentImageSrc;
      img.onload = () => {
        setLoadedImages(prev => new Set(prev).add(currentImageSrc));
        // Only make the first image visible after it loads
        if (loadedImages.size === 0) {
            setVisibleImageIndex(targetImageIndex);
        }
      };
      img.onerror = () => {
        console.error("Failed to load image:", currentImageSrc);
      }
    }
  }, [targetImageIndex, imagePool, loadedImages]);

  useEffect(() => {
    if (imagePool.length <= 1) return;

    const timer = setTimeout(() => {
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * imagePool.length);
      } while (nextIndex === visibleImageIndex);

      setTargetImageIndex(nextIndex);
    }, 10000);

    return () => clearTimeout(timer);
  }, [visibleImageIndex, imagePool]);

  useEffect(() => {
    const targetImageSrc = imagePool[targetImageIndex];
    if (targetImageSrc && loadedImages.has(targetImageSrc)) {
      setVisibleImageIndex(targetImageIndex);
    }
  }, [targetImageIndex, loadedImages, imagePool]);


  const togglePlayPause = () => {
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
        className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-black"
    >
        {/* Slideshow Background */}
        <div className="absolute inset-0 z-0">
            {imagePool.map((src, index) => (
                <div
                    key={`${src}-${index}`}
                    className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-[2000ms] ease-in-out ${index === visibleImageIndex ? 'kenburns' : ''}`}
                    style={{
                        backgroundImage: loadedImages.has(src) ? `url(${src})` : 'none',
                        opacity: index === visibleImageIndex ? 1 : 0,
                    }}
                />
            ))}
        </div>

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black bg-opacity-60 z-10"></div>
        
        {/* Loading Spinner */}
        {isLoading && <LoadingSpinner />}
        
        {/* Main Content: Centered Player UI */}
        <div className={`relative z-20 flex flex-col items-center justify-center text-center transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
            
            {/* Live Indicator */}
            <div className="flex items-center space-x-2 mb-4">
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <p className="text-red-400 font-bold text-sm uppercase tracking-widest text-glow">Ao Vivo</p>
            </div>

            {/* Central Disc */}
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 flex items-center justify-center">
                {/* Spinning Disc with Logo */}
                <div 
                    className={`absolute inset-0 rounded-full flex items-center justify-center bg-black/30 backdrop-blur-sm border-2 border-white/10 shadow-2xl ${isPlaying ? 'animate-spin-slow' : ''}`}
                    style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
                >
                    <img 
                        src={LOGO_URL} 
                        alt="Rádio 520 Logo" 
                        className="w-1/2 h-1/2 object-contain opacity-40" 
                    />
                </div>
                
                {/* Play/Pause Button */}
                <button
                    onClick={togglePlayPause}
                    className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-red-600/80 backdrop-blur-md text-white flex items-center justify-center shadow-lg transform transition-all duration-300 hover:scale-110 hover:bg-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/50"
                    aria-label={isPlaying ? 'Pausar' : 'Tocar'}
                >
                    {isPlaying ? <PauseIcon className="w-10 h-10 sm:w-12 sm:h-12" /> : <PlayIcon className="w-10 h-10 sm:w-12 sm:h-12" />}
                </button>
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