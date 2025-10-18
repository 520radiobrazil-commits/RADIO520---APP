import React from 'react';
import useWeather from '../hooks/useWeather';
import PrecipitationIcon from './icons/PrecipitationIcon';
import UvIndexIcon from './icons/UvIndexIcon';
import WarningIcon from './icons/WarningIcon';
import WeatherIcon from './WeatherIcon';

const WeatherDisplay: React.FC = () => {
  const { weather, isLoading, error } = useWeather();

  const getUvIndexStyle = (uvIndex: number) => {
    if (uvIndex <= 2) return 'text-green-400';
    if (uvIndex <= 5) return 'text-yellow-400';
    if (uvIndex <= 7) return 'text-orange-400';
    if (uvIndex <= 10) return 'text-red-500';
    return 'text-purple-400';
  };

  const renderLoading = () => (
    <div className="flex items-center px-3 py-1 text-xs text-gray-400">
      Carregando clima...
    </div>
  );

  const renderError = () => (
    <div className="flex items-center space-x-2 px-3 py-1 text-xs text-red-400">
      <WarningIcon className="w-4 h-4" />
      <span>Erro no clima</span>
    </div>
  );

  const renderWeather = () => {
    if (!weather) return null;
    
    const uvStyle = getUvIndexStyle(weather.uvIndex);

    return (
      <div className="flex items-center space-x-2 px-2 text-white" title={`${weather.description} em ${weather.locationName}`}>
        {/* Icon & Temp */}
        <div className="flex-shrink-0 flex items-center space-x-1">
          <div className="w-6 h-6 text-cyan-300">
             <WeatherIcon weatherCode={weather.weatherCode} />
          </div>
          <span className="font-mono text-xs font-medium text-glow-cyan">{weather.temperature}°C</span>
        </div>

        <div className="w-px h-6 bg-gray-600 self-center"></div>

        {/* Details */}
        <div className="flex-shrink-0 flex items-center space-x-2 text-xs">
           <div title={`Chance de chuva: ${weather.precipitationChance}%`}>
                <div className="flex items-center space-x-1 text-sky-300">
                    <PrecipitationIcon className="w-4 h-4" />
                    <span className="font-mono font-medium">{weather.precipitationChance}%</span>
                </div>
            </div>
            <div className="w-px h-4 bg-gray-600 self-center"></div>
            <div title={`Índice UV: ${weather.uvIndex}`}>
                 <div className={`flex items-center space-x-1 ${uvStyle}`}>
                    <UvIndexIcon className="w-4 h-4" />
                    <span className="font-mono font-medium">{weather.uvIndex}</span>
                </div>
            </div>
        </div>

        <div className="w-px h-6 bg-gray-600 self-center"></div>
        
        <div className="flex items-center space-x-1 pl-1 pr-2" title="Você está ouvindo a transmissão ao vivo">
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <p className="text-red-400 font-medium text-xs text-glow">Ao Vivo</p>
        </div>
      </div>
    );
  };
  
  if (isLoading && !weather) return renderLoading();
  if (error || !weather) return renderError();
  
  return renderWeather();
};

export default WeatherDisplay;