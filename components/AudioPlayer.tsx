

import React, { useState, useRef, useEffect } from 'react';
import PlayIcon from './icons/PlayIcon';
import PauseIcon from './icons/PauseIcon';
import LoadingSpinner from './LoadingSpinner';
import CloseIcon from './icons/CloseIcon';

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

interface AudioPlayerProps {
  isScheduleVisible: boolean;
  toggleSchedule: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ isScheduleVisible, toggleSchedule }) => {
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
    if (!audioRef.current?.src) {
        if (audioRef.current) {
            audioRef.current.src = AUDIO_STREAM_URL;
            audioRef.current.load();
        }
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
    <div className="relative w-full h-full overflow-hidden bg-black flex items-center justify-center">
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
        
        {/* Loading Overlay */}
        <div className={`absolute inset-0 z-30 transition-opacity duration-500 ease-in-out ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <LoadingSpinner />
        </div>
        
        {/* Player UI Container */}
        <div className={`absolute inset-0 z-20 transition-opacity duration-500 ease-in-out ${!isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="w-full h-full flex items-center justify-center">
              <div 
                className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-black/30 backdrop-blur-sm p-2 shadow-2xl border-2 border-white/20 flex items-center justify-center spin-slow"
                style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
              >
                <div 
                  className="w-full h-full rounded-full bg-contain bg-center bg-no-repeat"
                  style={{ 
                    backgroundImage: `url(${LOGO_URL})`
                  }}
                >
                </div>
              </div>
            </div>

            <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 flex items-center bg-gray-900/80 backdrop-blur-sm rounded-full shadow-lg overflow-hidden">
                <button
                    onClick={toggleSchedule}
                    className={`flex items-center space-x-2 pl-3 pr-2 py-1.5 text-xs sm:text-sm font-bold uppercase tracking-widest transition-colors duration-300 focus:outline-none ${
                        isScheduleVisible
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'text-purple-400 hover:bg-gray-800 focus:bg-gray-800 text-glow-purple'
                    }`}
                    aria-label={isScheduleVisible ? "Fechar programação" : "Ver programação"}
                    aria-expanded={isScheduleVisible}
                >
                    {isScheduleVisible ? (
                        <CloseIcon className="w-4 h-4" />
                    ) : (
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                        </span>
                    )}
                    <span className="pr-1">{isScheduleVisible ? "Fechar" : "Programação"}</span>
                </button>

                <div className="w-px h-4 bg-gray-600 self-center"></div>

                <div className="flex items-center space-x-2 px-3 py-1.5 cursor-default" title="Você está ouvindo a transmissão ao vivo">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    <p className="text-red-400 font-bold text-xs sm:text-sm uppercase tracking-widest text-glow">Ao Vivo</p>
                </div>
            </div>


            <button
                onClick={togglePlayPause}
                className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-30 w-14 h-14 rounded-full bg-red-600/50 backdrop-blur-sm text-white flex items-center justify-center shadow-lg transform transition-all duration-300 hover:scale-110 hover:bg-red-500/70 focus:outline-none focus:ring-4 focus:ring-red-500/50"
                aria-label={isPlaying ? 'Pausar' : 'Tocar'}
            >
                {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
            </button>
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