import React from 'react';
import SunIcon from './icons/SunIcon';
import CloudIcon from './icons/CloudIcon';
import RainIcon from './icons/RainIcon';
import ThunderstormIcon from './icons/ThunderstormIcon';
import FogIcon from './icons/FogIcon';

interface WeatherIconProps {
  weatherCode: number;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ weatherCode }) => {
  if (weatherCode <= 1) { // Clear, Mainly clear
    return <SunIcon />;
  }
  if (weatherCode <= 3) { // Partly cloudy, Overcast
    return <CloudIcon />;
  }
  if (weatherCode === 45 || weatherCode === 48) { // Fog
    return <FogIcon />;
  }
  if (
    (weatherCode >= 51 && weatherCode <= 67) || // Drizzle and Rain
    (weatherCode >= 80 && weatherCode <= 86)    // Rain showers and Snow showers
  ) {
    return <RainIcon />;
  }
  if (weatherCode >= 95 && weatherCode <= 99) { // Thunderstorm
    return <ThunderstormIcon />;
  }
  
  // Fallback for snow, etc.
  return <CloudIcon />;
};

export default WeatherIcon;
