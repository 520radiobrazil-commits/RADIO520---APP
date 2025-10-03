import React, { useState } from 'react';
import { PlayerMode } from './types';
import Header from './components/Header';
import VideoPlayer from './components/VideoPlayer';
import AudioPlayer from './components/AudioPlayer';
import WhatsAppIcon from './components/icons/WhatsAppIcon';
import NowPlaying from './components/NowPlaying';
import InstagramIcon from './components/icons/InstagramIcon';
import FacebookIcon from './components/icons/FacebookIcon';
import TwitterIcon from './components/icons/TwitterIcon';
import { NotificationProvider } from './context/NotificationContext';
import Notification from './components/Notification';
import TikTokIcon from './components/icons/TikTokIcon';
import KwaiIcon from './components/icons/KwaiIcon';
import HeadphoneIcon from './components/icons/HeadphoneIcon';
import VideoIcon from './components/icons/VideoIcon';
import CloseIcon from './components/icons/CloseIcon';
import GlobeIcon from './components/icons/GlobeIcon';
import NewsTicker from './components/NewsTicker';
import MusicNoteIcon from './components/icons/MusicNoteIcon';

const App: React.FC = () => {
  const [playerMode, setPlayerMode] = useState<PlayerMode>(PlayerMode.AUDIO);
  const [isScheduleVisible, setIsScheduleVisible] = useState(false);
  // Botões compactos com texto responsivo para caber em uma linha.
  const baseButtonClasses = "flex-shrink-0 flex items-center justify-center space-x-1 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900";
  
  const activeAudioButtonClasses = "bg-sky-600 text-white focus:ring-sky-500 shadow-lg shadow-sky-500/50";
  const inactiveGenericButtonClasses = "bg-gray-700 text-gray-300 hover:bg-gray-600 focus:ring-gray-500";

  const activeVideoButtonClasses = "bg-red-600 text-white focus:ring-red-500 shadow-lg shadow-red-500/50";
  const inactiveVideoButtonClasses = "bg-red-900 text-red-200 hover:bg-red-800 focus:ring-red-600";


  const toggleSchedule = () => setIsScheduleVisible(prev => !prev);


  return (
    <NotificationProvider>
      <div className="flex flex-col min-h-screen text-white font-sans">
        <Header />
        <NewsTicker />
        <main className="flex-grow flex flex-col items-center justify-center p-2 sm:p-4 lg:p-8 space-y-4 md:space-y-6">
          <div className="relative w-full max-w-xl lg:max-w-2xl xl:max-w-3xl bg-black rounded-xl shadow-2xl overflow-hidden aspect-video">
            {playerMode === PlayerMode.VIDEO ? <VideoPlayer /> : <AudioPlayer isScheduleVisible={isScheduleVisible} toggleSchedule={toggleSchedule} />}
          </div>
          
          <div className="w-full flex flex-nowrap items-center justify-center gap-2 overflow-x-auto px-2 py-2 scrollbar-hide">
              <button
                onClick={() => setPlayerMode(PlayerMode.AUDIO)}
                className={`${baseButtonClasses} ${playerMode === PlayerMode.AUDIO ? activeAudioButtonClasses : inactiveGenericButtonClasses}`}
              >
                <HeadphoneIcon className="w-4 h-4" />
                <span><span className="hidden sm:inline">Ouvir </span>Rádio</span>
              </button>
               <button
                  onClick={() => setPlayerMode(PlayerMode.VIDEO)}
                  className={`${baseButtonClasses} ${playerMode === PlayerMode.VIDEO ? activeVideoButtonClasses : inactiveVideoButtonClasses}`}
                >
                  <VideoIcon className="w-4 h-4" />
                  <span><span className="hidden sm:inline">Vídeo </span>ao Vivo</span>
                </button>
              <a
                href="https://wa.me/5584999995200?text=Olá%20Rádio%20520!%20Gostaria%20de%20pedir%20uma%20música."
                target="_blank"
                rel="noopener noreferrer"
                className={`${baseButtonClasses} bg-pink-600 text-white hover:bg-pink-700 focus:ring-pink-500`}
                >
                <MusicNoteIcon className="w-4 h-4" />
                <span><span className="hidden sm:inline">Peça sua </span>Música</span>
              </a>
              <a
                href="https://www.radio520.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className={`${baseButtonClasses} bg-purple-600 text-white hover:bg-purple-700`}
              >
                <GlobeIcon className="w-4 h-4" />
                <span><span className="hidden sm:inline">Nosso </span>Site</span>
              </a>
              <a
                href="https://whatsapp.com/channel/0029Va6IguvCxoAuGyos6330"
                target="_blank"
                rel="noopener noreferrer"
                className={`${baseButtonClasses} bg-green-600 text-white hover:bg-green-700`}
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span><span className="hidden sm:inline">CENTRAL </span>520</span>
              </a>
          </div>

          <NowPlaying isScheduleVisible={isScheduleVisible} playerMode={playerMode} />

        </main>
        <footer className="text-center p-3 sm:p-4 lg:p-6 text-gray-400">
          <div className="flex justify-center items-center space-x-4 sm:space-x-6 lg:space-x-8 mb-4">
              <a href="https://instagram.com/radio520" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110 social-icon-animation">
                  <InstagramIcon className="w-6 h-6" />
              </a>
              <a href="https://facebook.com/radio520" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110 social-icon-animation" style={{ animationDelay: '0.3s' }}>
                  <FacebookIcon className="w-6 h-6" />
              </a>
              <a href="https://x.com/radio520" target="_blank" rel="noopener noreferrer" aria-label="Twitter X" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110 social-icon-animation" style={{ animationDelay: '0.6s' }}>
                  <TwitterIcon className="w-6 h-6" />
              </a>
              <a href="https://www.tiktok.com/@radio520oficial" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110 social-icon-animation" style={{ animationDelay: '0.9s' }}>
                  <TikTokIcon className="w-6 h-6" />
              </a>
              <a href="https://www.kwai.com/@radio520" target="_blank" rel="noopener noreferrer" aria-label="Kwai" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110 social-icon-animation" style={{ animationDelay: '1.2s' }}>
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