import React from 'react';
import LocalTime from './LocalTime';
import WeatherDisplay from './WeatherDisplay';
import useWeather from '../hooks/useWeather';

const InfoBar: React.FC = () => {
    const { weather, isLoading, isRefreshing, error, refreshWeather } = useWeather();
    return (
        <div className="w-full bg-gray-900/80 backdrop-blur-sm">
            <div className="flex items-center justify-between px-4 py-1.5 min-h-[36px]">
                <LocalTime />
                <WeatherDisplay 
                    weather={weather} 
                    isLoading={isLoading} 
                    isRefreshing={isRefreshing}
                    error={error} 
                    refreshWeather={refreshWeather}
                />
            </div>
        </div>
    );
};

export default InfoBar;