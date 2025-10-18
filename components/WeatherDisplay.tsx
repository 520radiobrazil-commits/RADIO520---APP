import React from 'react';
import { WeatherData } from '../hooks/useWeather';
import PrecipitationIcon from './icons/PrecipitationIcon';
import UvIndexIcon from './icons/UvIndexIcon';
import WarningIcon from './icons/WarningIcon';
import WeatherIcon from './WeatherIcon';
import ThunderstormIcon from './icons/ThunderstormIcon';
import RainIcon from './icons/RainIcon';

interface WeatherDisplayProps {
  weather: WeatherData | null;
  isLoading: boolean;
  error: string | null;
}

const getUvIndexStyle = (uvIndex: number) => {
  if (uvIndex <= 2) return 'text-green-400';
  if (uvIndex <= 5) return 'text-yellow-400';
  if (uvIndex <= 7) return 'text-orange-400';
  if (uvIndex <= 10) return 'text-red-500';
  return 'text-purple-400';
};

// This component displays either a specific weather alert or the default "Live" indicator.
const AlertIndicator: React.FC<{ alert: string | null }> = ({ alert }) => {
    if (!alert) {
        return (
            <div className="flex items-center space-x-1.5" title="Você está ouvindo a transmissão ao vivo">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <p className="text-red-400 font-bold text-xs tracking-wide text-glow">AO VIVO</p>
            </div>
        );
    }

    let iconElement;
    let shortText;
    let containerStyle;

    switch (alert) {
        case "Alerta de Trovoada":
            iconElement = <ThunderstormIcon className="w-4 h-4 animate-pulse" />;
            shortText = "Trovoada";
            containerStyle = "text-yellow-300";
            break;
        case "Alerta de Chuva/Neve Forte":
            iconElement = <RainIcon className="w-4 h-4 animate-rain-drop" />;
            shortText = "Chuva Forte";
            containerStyle = "text-sky-300";
            break;
        case "Índice UV Extremo":
            iconElement = <UvIndexIcon className="w-4 h-4 animate-uv-glow" />;
            shortText = "UV Extremo";
            containerStyle = "text-purple-400";
            break;
        case "Alta Chance de Chuva":
            iconElement = <PrecipitationIcon className="w-4 h-4 animate-rain-drop" />;
            shortText = "Chance de Chuva";
            containerStyle = "text-cyan-400";
            break;
        default:
            iconElement = <WarningIcon className="w-4 h-4 animate-warning-pulse" />;
            shortText = "Alerta";
            containerStyle = "text-orange-400";
            break;
    }

    return (
        <div className={`flex items-center space-x-1.5 ${containerStyle}`} title={alert}>
            {iconElement}
            <p className="font-bold text-xs tracking-wide">{shortText}</p>
        </div>
    );
};


const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weather, isLoading, error }) => {
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
      <div className="flex items-center space-x-2 text-white" title={`${weather.description} em ${weather.locationName}`}>
        <div className="w-px h-5 bg-gray-600 self-center"></div>
        {/* Icon & Temp */}
        <div className="flex-shrink-0 flex items-center space-x-1">
          <div className="w-5 h-5 text-cyan-300">
             <WeatherIcon weatherCode={weather.weatherCode} />
          </div>
          <span className="font-mono text-xs font-medium text-glow-cyan">{weather.temperature}°C</span>
        </div>

        {/* Details */}
        <div className="flex items-center space-x-2">
            <div className="w-px h-5 bg-gray-600 self-center"></div>
            <div className="flex-shrink-0 flex items-center space-x-2 text-xs">
              <div title={`Chance de chuva: ${weather.precipitationChance}%`}>
                    <div className="flex items-center space-x-1 text-sky-300">
                        <PrecipitationIcon className="w-3.5 h-3.5" />
                        <span className="font-mono font-medium">{weather.precipitationChance}%</span>
                    </div>
                </div>
                <div className="w-px h-4 bg-gray-600 self-center"></div>
                <div title={`Índice UV: ${weather.uvIndex}`}>
                    <div className={`flex items-center space-x-1 ${uvStyle}`}>
                        <UvIndexIcon className="w-3.5 h-3.5" />
                        <span className="font-mono font-medium">{weather.uvIndex}</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="w-px h-5 bg-gray-600 self-center"></div>
        
        <AlertIndicator alert={weather.alert} />
      </div>
    );
  };
  
  if (isLoading && !weather) return renderLoading();
  if (error || !weather) return renderError();
  
  return renderWeather();
};

export default WeatherDisplay;