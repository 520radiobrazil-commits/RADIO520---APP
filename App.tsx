import React, { useState } from 'react';
import { PlayerMode } from './types';
import Header from './components/Header';
import VideoPlayer from './components/VideoPlayer';
import AudioPlayer from './components/AudioPlayer';
import PodcastIcon from './components/icons/PodcastIcon';
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
import GlobeIcon from './components/icons/GlobeIcon';
import NewsTicker from './components/NewsTicker';
import WhatsAppIcon from './components/icons/WhatsAppIcon';

const App: React.FC = () => {
  const [playerMode, setPlayerMode] = useState<PlayerMode>(PlayerMode.AUDIO);
  // Botões compactos com texto responsivo para caber em uma linha.
  const baseButtonClasses = "flex-shrink-0 flex items-center justify-center space-x-1 px-2 py-1 rounded-full text-[11px] font-medium transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900";
  
  const activeAudioButtonClasses = "bg-sky-600 text-white focus:ring-sky-500 shadow-md shadow-sky-500/50";
  const inactiveGenericButtonClasses = "bg-gray-700 text-gray-300 hover:bg-gray-600 focus:ring-gray-500";

  const activeVideoButtonClasses = "bg-red-600 text-white focus:ring-red-500 shadow-md shadow-red-500/50";
  const inactiveVideoButtonClasses = "bg-red-900 text-red-200 hover:bg-red-800 focus:ring-red-600";


  return (
    <NotificationProvider>
      <div className="flex flex-col min-h-screen text-white font-sans">
        <Header />
        <div className="flex justify-center py-2 sm:py-3 bg-black bg-opacity-10">
          <a href="https://radio520.webradiosite.com/pagina/3177862/popnews/" target="_blank" rel="noopener noreferrer">
            <img 
              src="https://public-rf-upload.minhawebradio.net/249695/ad/9a12d0c1f1200dfdd0595d8d0ac85ced.jpg" 
              alt="Banner Promocional" 
              className="w-full max-w-4xl rounded-md shadow-lg transition-transform duration-300 hover:scale-[1.02]"
            />
          </a>
        </div>
        <NewsTicker />
        <main className="flex-grow flex flex-col items-center justify-center p-2 sm:p-4 lg:p-8 space-y-4 md:space-y-6">
          <div className="relative w-full max-w-xl lg:max-w-2xl xl:max-w-3xl bg-black rounded-xl shadow-2xl overflow-hidden aspect-video">
            {playerMode === PlayerMode.VIDEO ? <VideoPlayer /> : <AudioPlayer />}
          </div>
          
          <div className="w-full flex flex-nowrap items-center justify-center gap-2 overflow-x-auto px-2 py-2 scrollbar-hide">
              <button
                onClick={() => setPlayerMode(PlayerMode.AUDIO)}
                className={`${baseButtonClasses} ${playerMode === PlayerMode.AUDIO ? activeAudioButtonClasses : inactiveGenericButtonClasses}`}
              >
                <HeadphoneIcon className="w-3.5 h-3.5" />
                <span><span className="hidden sm:inline">Ouvir </span>RÁDIO</span>
              </button>
               <button
                  onClick={() => setPlayerMode(PlayerMode.VIDEO)}
                  className={`${baseButtonClasses} ${playerMode === PlayerMode.VIDEO ? activeVideoButtonClasses : inactiveVideoButtonClasses}`}
                >
                  <VideoIcon className="w-3.5 h-3.5" />
                  <span><span className="hidden sm:inline">Vídeo </span>LIVE</span>
                </button>
              <a
                href="https://wa.me/5511988277967?text=Olá%20Rádio%20520!"
                target="_blank"
                rel="noopener noreferrer"
                className={`${baseButtonClasses} bg-green-600 text-white hover:bg-green-700 focus:ring-green-500`}
                >
                <WhatsAppIcon className="w-3.5 h-3.5" />
                <span>CHAT</span>
              </a>
              <a
                href="https://www.radio520.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className={`${baseButtonClasses} bg-purple-600 text-white hover:bg-purple-700`}
              >
                <GlobeIcon className="w-3.5 h-3.5" />
                <span><span className="hidden sm:inline">NOSSO </span>SITE</span>
              </a>
              <a
                href="https://open.spotify.com/user/31bozpr55fnrgkm7yy7cctairaty?si=QSuJlrPKS9690cgtcpvKWQ"
                target="_blank"
                rel="noopener noreferrer"
                className={`${baseButtonClasses} bg-indigo-600 text-white hover:bg-indigo-700`}
              >
                <PodcastIcon className="w-3.5 h-3.5" />
                <span>PODCASTS</span>
              </a>
          </div>

          <NowPlaying playerMode={playerMode} />

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