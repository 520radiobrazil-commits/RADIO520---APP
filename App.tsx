
import React, { useState } from 'react';
import { PlayerMode } from './types';
import Header from './components/Header';
import PlayerControls from './components/PlayerControls';
import VideoPlayer from './components/VideoPlayer';
import AudioPlayer from './components/AudioPlayer';
import WhatsAppIcon from './components/icons/WhatsAppIcon';
import NowPlaying from './components/NowPlaying';
import NewsTicker from './components/NewsTicker';
import InstagramIcon from './components/icons/InstagramIcon';
import FacebookIcon from './components/icons/FacebookIcon';
import TwitterIcon from './components/icons/TwitterIcon';
import { NotificationProvider } from './context/NotificationContext';
import Notification from './components/Notification';
import TikTokIcon from './components/icons/TikTokIcon';
import KwaiIcon from './components/icons/KwaiIcon';

const App: React.FC = () => {
  const [playerMode, setPlayerMode] = useState<PlayerMode>(PlayerMode.AUDIO);
  const baseButtonClasses = "flex items-center justify-center space-x-2 px-4 py-2 sm:px-6 sm:py-3 rounded-full text-xs sm:text-sm md:text-base font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900";


  return (
    <NotificationProvider>
      <div className="flex flex-col min-h-screen text-white font-sans">
        <Header />
        <NewsTicker />
        <main className="flex-grow flex flex-col items-center justify-center p-2 sm:p-4 lg:p-8 space-y-4 md:space-y-6">
          <div className="w-full max-w-3xl lg:max-w-4xl xl:max-w-5xl bg-black rounded-xl shadow-2xl overflow-hidden aspect-video">
            {playerMode === PlayerMode.VIDEO ? <VideoPlayer /> : <AudioPlayer />}
          </div>
          
          <NowPlaying />

          <div className="flex flex-wrap justify-center items-center gap-4">
              <PlayerControls activeMode={playerMode} setMode={setPlayerMode} />
              <a
                href="https://whatsapp.com/channel/0029Va6IguvCxoAuGyos6330"
                target="_blank"
                rel="noopener noreferrer"
                className={`${baseButtonClasses} bg-green-600 text-white hover:bg-green-700`}
              >
                <WhatsAppIcon className="w-5 h-5" />
                <span>CENTRAL 520</span>
              </a>
              <a
                href="https://www.radio520.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className={`${baseButtonClasses} bg-orange-500 text-white hover:bg-orange-600`}
              >
                <span>RADIO520.COM.BR</span>
              </a>
          </div>
        </main>
        <footer className="text-center p-3 sm:p-4 lg:p-6 text-gray-400">
          <div className="flex justify-center items-center space-x-4 sm:space-x-6 lg:space-x-8 mb-4">
              <a href="https://instagram.com/radio520" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <InstagramIcon className="w-6 h-6" />
              </a>
              <a href="https://facebook.com/radio520" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <FacebookIcon className="w-6 h-6" />
              </a>
              <a href="https://x.com/radio520" target="_blank" rel="noopener noreferrer" aria-label="Twitter X" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <TwitterIcon className="w-6 h-6" />
              </a>
              <a href="https://tiktok.com/@radio520" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <TikTokIcon className="w-6 h-6" />
              </a>
              <a href="https://www.kwai.com/@radio520" target="_blank" rel="noopener noreferrer" aria-label="Kwai" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <KwaiIcon className="w-6 h-6" />
              </a>
          </div>
          <p className="text-xs text-gray-500">&copy; 2024 Rádio 520. Todos os direitos reservados.</p>
        </footer>
      </div>
      <Notification />
    </NotificationProvider>
  );
};

export default App;
