import React, { useState, useEffect } from 'react';
import LocalTime from './LocalTime';
import WeatherDisplay from './WeatherDisplay';
import useWeather, { WeatherData } from '../hooks/useWeather';
import WarningIcon from './icons/WarningIcon';
import LocationMarkerIcon from './icons/LocationMarkerIcon';
import GlobeIcon from './icons/GlobeIcon';

interface TickerMessage {
    text: string;
    type: 'alert' | 'location' | 'site';
}

interface LocationAlertTickerProps {
  weather: WeatherData | null;
  isLoading: boolean;
}

// Component for the animated second line that cycles between location and alerts/site
const LocationAlertTicker: React.FC<LocationAlertTickerProps> = ({ weather, isLoading }) => {
    const [messages, setMessages] = useState<TickerMessage[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (isLoading || !weather) {
            setMessages([]);
            return;
        }

        const newMessages: TickerMessage[] = [];
        
        // Add alert if it exists
        if (weather.alert) {
            newMessages.push({ text: weather.alert, type: 'alert' });
        }

        // Always add the radio's website
        newMessages.push({ text: 'www.radio520.com.br', type: 'site' });

        // Add location if it exists
        if (weather.locationName) {
            newMessages.push({ text: weather.locationName, type: 'location' });
        }

        setMessages(newMessages);
        setCurrentIndex(0); // Reset index when messages change
    }, [weather, isLoading]);
    
    useEffect(() => {
        if (messages.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % messages.length);
        }, 4000); // Change message every 4 seconds
        return () => clearInterval(interval);
    }, [messages]);

    if (isLoading || messages.length === 0) {
        return <div className="h-6"></div>; // Keep space consistent
    }

    const currentItem = messages[currentIndex];

    const renderIcon = () => {
        switch (currentItem.type) {
            case 'alert':
                return <WarningIcon className="w-3.5 h-3.5 flex-shrink-0 text-yellow-300" />;
            case 'location':
                return <LocationMarkerIcon className="w-3.5 h-3.5 flex-shrink-0 text-sky-300" />;
            case 'site':
                return <GlobeIcon className="w-3.5 h-3.5 flex-shrink-0 text-purple-300" />;
            default:
                return null;
        }
    };

    const getTextStyle = () => {
        switch (currentItem.type) {
            case 'alert':
                return 'text-yellow-300';
            case 'location':
                return 'text-sky-300';
            case 'site':
                return 'text-purple-300';
            default:
                return 'text-gray-300';
        }
    };

    return (
        <div className="w-full bg-black/30 backdrop-blur-sm py-1 overflow-hidden h-6 flex items-center justify-center">
            <div key={currentIndex} className="flex items-center space-x-1.5 animate-fade-in">
                {renderIcon()}
                <span className={`font-mono text-xs font-medium text-center ${getTextStyle()}`}>
                    {currentItem.text}
                </span>
            </div>
        </div>
    );
};


const InfoBar: React.FC = () => {
    const { weather, isLoading, error } = useWeather();
    return (
        <div className="w-full bg-gray-900/80 backdrop-blur-sm">
            <div className="flex items-center justify-between px-4 py-1.5">
                <LocalTime />
                <WeatherDisplay weather={weather} isLoading={isLoading} error={error} />
            </div>
            <LocationAlertTicker weather={weather} isLoading={isLoading} />
        </div>
    );
};

export default InfoBar;