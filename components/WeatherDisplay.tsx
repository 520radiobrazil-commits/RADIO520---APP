import React from 'react';
import { WeatherData } from '../hooks/useWeather';
import PrecipitationIcon from './icons/PrecipitationIcon';
import UvIndexIcon from './icons/UvIndexIcon';
import WarningIcon from './icons/WarningIcon';
import WeatherIcon from './WeatherIcon';
import LocationMarkerIcon from './icons/LocationMarkerIcon';
import RefreshIcon from './icons/RefreshIcon';

interface WeatherDisplayProps {
  weather: WeatherData | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  refreshWeather: () => void;
}

const getUvIndexStyle = (uvIndex: number) => {
  if (uvIndex <= 2) return 'text-green-400';
  if (uvIndex <= 5) return 'text-yellow-400';
  if (uvIndex <= 7) return 'text-orange-400';
  if (uvIndex <= 10) return 'text-red-500';
  return 'text-purple-400';
};

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weather, isLoading, isRefreshing, error, refreshWeather }) => {
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
      <div className="flex items-center space-x-2 sm:space-x-3 text-white text-xs">
        {/* Location and Alert */}
        <div className="flex items-center space-x-1.5" title={`Clima para ${weather.locationName}`}>
          <LocationMarkerIcon className="w-4 h-4 text-sky-300 flex-shrink-0" />
          <span className="font-medium truncate max-w-[100px] sm:max-w-none">{weather.locationName}</span>
          {weather.alert && (
            <span className="text-yellow-400 font-bold hidden sm:inline" title={weather.alert}>
              ({weather.alert.replace('Alerta de ', '').replace('Índice', '')})
            </span>
          )}
        </div>
        
        <div className="w-px h-5 bg-gray-600 self-center"></div>

        {/* Weather Details */}
        <div className="flex items-center space-x-2">
          {/* Icon & Temp */}
          <div className="flex-shrink-0 flex items-center space-x-1" title={weather.description}>
            <div className="w-5 h-5 text-cyan-300">
              <WeatherIcon weatherCode={weather.weatherCode} />
            </div>
            <span className="font-mono font-medium text-glow-cyan">{weather.temperature}°C</span>
          </div>
          {/* Precip & UV on larger screens */}
          <div className="hidden md:flex items-center space-x-2">
            <div title={`Chance de chuva: ${weather.precipitationChance}%`} className="flex items-center space-x-1 text-sky-300">
              <PrecipitationIcon className="w-3.5 h-3.5" />
              <span className="font-mono font-medium">{weather.precipitationChance}%</span>
            </div>
            <div title={`Índice UV: ${weather.uvIndex}`} className={`flex items-center space-x-1 ${uvStyle}`}>
              <UvIndexIcon className="w-3.5 h-3.5" />
              <span className="font-mono font-medium">{weather.uvIndex}</span>
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <button 
          onClick={refreshWeather}
          disabled={isRefreshing}
          className="p-1 rounded-full text-gray-400 transition-colors hover:text-white hover:bg-gray-700 disabled:cursor-wait"
          title="Atualizar clima"
          aria-label="Atualizar informações do clima"
        >
          <RefreshIcon className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>
    );
  };
  
  if (isLoading && !weather) return renderLoading();
  // Don't show error if we are just refreshing in the background
  if (error && !weather) return renderError();
  if (!weather) return null; // Handle case where there's no error but no weather yet
  
  return renderWeather();
};

export default WeatherDisplay;