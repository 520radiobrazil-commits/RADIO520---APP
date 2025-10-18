import React, { useState, useEffect } from 'react';
import LocalTime from './LocalTime';
import WeatherDisplay from './WeatherDisplay';
import useWeather from '../hooks/useWeather';
import WarningIcon from './icons/WarningIcon';
import LocationMarkerIcon from './icons/LocationMarkerIcon';

const InfoBar: React.FC = () => {
    const { weather } = useWeather();
    const [displayingAlert, setDisplayingAlert] = useState(true);
    const [isAlertBarVisible, setIsAlertBarVisible] = useState(false);

    useEffect(() => {
        let timer: number;
        if (weather?.alert) {
            // Delay showing the alert bar to prevent jarring layout shifts on load
            timer = window.setTimeout(() => setIsAlertBarVisible(true), 500);
        } else {
            setIsAlertBarVisible(false);
        }
        return () => clearTimeout(timer);
    }, [weather?.alert]);

    useEffect(() => {
        if (isAlertBarVisible) {
            const interval = setInterval(() => {
                setDisplayingAlert(prev => !prev);
            }, 4000); // Switch every 4 seconds

            return () => clearInterval(interval);
        }
    }, [isAlertBarVisible]);
    
    // Reset the display to the alert when the bar becomes visible
    useEffect(() => {
      if (isAlertBarVisible) {
        setDisplayingAlert(true);
      }
    }, [isAlertBarVisible]);

    const alertContent = (
        <div key={displayingAlert ? 'alert' : 'location'} className="animate-fade-in flex items-center justify-center">
            {displayingAlert && weather?.alert ? (
                <>
                    <WarningIcon className="w-4 h-4 mr-2 flex-shrink-0 text-yellow-300" />
                    <span className="text-xs font-semibold tracking-wider text-yellow-300">{weather.alert}</span>
                </>
            ) : (
                <>
                    <LocationMarkerIcon className="w-4 h-4 mr-2 flex-shrink-0 text-sky-400" />
                    <span className="text-xs font-semibold tracking-wider text-sky-300">{weather?.locationName}</span>
                </>
            )}
        </div>
    );

    return (
        <div className={`bg-gray-900/80 backdrop-blur-sm shadow-lg transition-all duration-500 ease-in-out ${isAlertBarVisible ? 'rounded-xl' : 'rounded-full'}`}>
            <div className="flex items-center p-1">
                <LocalTime />
                <div className="w-px h-6 bg-gray-600"></div>
                <WeatherDisplay />
            </div>
            {isAlertBarVisible && (
                 <div className="border-t border-gray-700/50 mx-3 mb-1 overflow-hidden">
                    <div className="h-5 flex items-center justify-center">
                       {alertContent}
                    </div>
                </div>
            )}
        </div>
    );
};

export default InfoBar;