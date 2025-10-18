import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import NewsTicker from './NewsTicker';

const VideoPlayer: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="w-full h-full bg-black relative">
      {isLoading && <LoadingSpinner />}
      <div className={`absolute top-0 left-0 right-0 z-10 transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <NewsTicker />
      </div>
      <iframe
        src="https://player.mux.com/X4VLtNG7D4yYOT5IT9jpbUp6q6KxLnenmcU11UVglpM"
        className={`w-full h-full border-none transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
        allowFullScreen
        onLoad={() => setIsLoading(false)}
      ></iframe>
    </div>
  );
};

export default VideoPlayer;