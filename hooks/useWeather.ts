import { useState, useEffect, useCallback } from 'react';

export interface WeatherData {
  temperature: number;
  precipitationChance: number;
  uvIndex: number;
  description: string;
  alert: string | null;
  locationName: string;
  weatherCode: number;
}

export interface Location {
    name: string;
    latitude: number;
    longitude: number;
}

// WMO Weather interpretation codes
const getWeatherDescription = (code: number): string => {
  const descriptions: { [key: number]: string } = {
    0: 'Céu limpo',
    1: 'Principalmente limpo',
    2: 'Parcialmente nublado',
    3: 'Nublado',
    45: 'Nevoeiro',
    48: 'Nevoeiro com geada',
    51: 'Garoa leve',
    53: 'Garoa moderada',
    55: 'Garoa forte',
    56: 'Garoa gelada leve',
    57: 'Garoa gelada forte',
    61: 'Chuva fraca',
    63: 'Chuva moderada',
    65: 'Chuva forte',
    66: 'Chuva gelada leve',
    67: 'Chuva gelada forte',
    71: 'Neve fraca',
    73: 'Neve moderada',
    75: 'Neve forte',
    77: 'Grãos de neve',
    80: 'Pancadas de chuva fracas',
    81: 'Pancadas de chuva moderadas',
    82: 'Pancadas de chuva violentas',
    85: 'Pancadas de neve fracas',
    86: 'Pancadas de neve fortes',
    95: 'Trovoada',
    96: 'Trovoada com granizo fraco',
    99: 'Trovoada com granizo forte',
  };
  return descriptions[code] || 'Condição desconhecida';
};

const generateAlert = (daily: any, current: any): string | null => {
    const weatherCode = current.weather_code;
    if ([95, 96, 99].includes(weatherCode)) {
        return "Alerta de Trovoada";
    }
    if ([65, 67, 75, 82, 86].includes(weatherCode)) {
        return "Alerta de Chuva/Neve Forte";
    }
    
    // Alert is based on the daily maximum UV index for better safety warnings
    const uvIndex = daily.uv_index_max?.[0];
    if (uvIndex && uvIndex > 8) {
        return "Índice UV Extremo";
    }

    const precipChance = daily.precipitation_probability_max?.[0];
    if (precipChance && precipChance > 80) {
        return "Alta Chance de Chuva";
    }

    return null;
};

const LOCATION_STORAGE_KEY = 'radio520_weather_location';

const useWeather = () => {
  const [weather, setWeather] = useState<Omit<WeatherData, 'locationName'> | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveLocation = (loc: Location) => {
    localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(loc));
    setLocation(loc);
  };

  const fetchWeather = useCallback(async (currentLocation: Location, isRefresh: boolean = false) => {
    if (!isRefresh) setIsLoading(true);
    else setIsRefreshing(true);
    setError(null);

    const { latitude, longitude } = currentLocation;
    // Updated URL to fetch current UV index for display, while keeping daily max for alerts.
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,uv_index&daily=precipitation_probability_max,uv_index_max&timezone=auto&forecast_days=1`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`API de clima falhou: ${response.status}`);
      const data = await response.json();

      if (!data.current || !data.daily) {
          throw new Error("Dados meteorológicos inválidos recebidos.");
      }

      const alertMessage = generateAlert(data.daily, data.current);

      const weatherData = {
          temperature: Math.round(data.current.temperature_2m),
          precipitationChance: data.daily.precipitation_probability_max[0] || 0,
          // Use current UV index for accurate real-time display.
          uvIndex: Math.round(data.current.uv_index || 0),
          description: getWeatherDescription(data.current.weather_code),
          alert: alertMessage,
          weatherCode: data.current.weather_code,
      };

      setWeather(weatherData);

    } catch (err: any) {
      console.error("Erro ao buscar dados do tempo:", err);
      setError(err.message || "Falha ao buscar clima.");
      setWeather(null);
    } finally {
        if (!isRefresh) setIsLoading(false);
        else setIsRefreshing(false);
    }
  }, []);

  // Effect for initial location detection
  useEffect(() => {
    const getInitialLocation = async () => {
        const savedLocation = localStorage.getItem(LOCATION_STORAGE_KEY);
        if (savedLocation) {
            try {
                setLocation(JSON.parse(savedLocation));
                return;
            } catch (e) {
                localStorage.removeItem(LOCATION_STORAGE_KEY);
            }
        }

        const reverseGeocode = async (lat: number, lon: number): Promise<string | null> => {
            try {
                const response = await fetch(`https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}`);
                if (!response.ok) {
                    console.error(`Reverse geocoding API failed with status: ${response.status}`);
                    return null;
                }
                const data = await response.json();
                if (!data || Object.keys(data).length === 0) {
                    console.warn("Reverse geocoding returned empty data.");
                    return null;
                }
                // Use the most specific name available
                return data.name || data.admin4 || data.admin3 || data.admin2 || null;
            } catch (error) {
                console.error("Reverse geocoding failed", error);
                return null;
            }
        };

        const fallbackToIp = async () => {
            // Attempt 1: ip-api.com
            try {
                const response = await fetch('https://ip-api.com/json/?fields=status,message,city,lat,lon');
                if (!response.ok) throw new Error(`ip-api.com status: ${response.status}`);
                const data = await response.json();
                if (data.status === 'success' && data.city) {
                    saveLocation({ name: data.city, latitude: data.lat, longitude: data.lon });
                    return;
                }
                if (data.message) throw new Error(`ip-api.com message: ${data.message}`);
            } catch (error) {
                console.warn("IP geolocation via ip-api.com failed. Trying next provider.", error);
            }

            // Attempt 2: ipinfo.io
            try {
                const response = await fetch('https://ipinfo.io/json');
                if (!response.ok) throw new Error(`ipinfo.io status: ${response.status}`);
                const data = await response.json();
                if (data.city && data.loc) {
                    const [lat, lon] = data.loc.split(',').map(Number);
                    saveLocation({ name: data.city, latitude: lat, longitude: lon });
                    return;
                }
            } catch (error) {
                console.warn("IP geolocation via ipinfo.io failed. Using final fallback.", error);
            }

            // Final fallback
            saveLocation({ name: 'São Paulo', latitude: -23.5505, longitude: -46.6333 });
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    const cityName = await reverseGeocode(latitude, longitude);
                    if (cityName) {
                        saveLocation({
                            name: cityName,
                            latitude: latitude,
                            longitude: longitude,
                        });
                    } else {
                        await fallbackToIp();
                    }
                },
                (error) => {
                    console.warn(`Geolocation error (${error.code}): ${error.message}`);
                    fallbackToIp();
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                }
            );
        } else {
            console.warn("Geolocation not supported by this browser.");
            fallbackToIp();
        }
    };

    getInitialLocation();
  }, []);


  // Effect to fetch weather when location changes
  useEffect(() => {
    if (location) {
        fetchWeather(location);
    }
    const intervalId = setInterval(() => {
        if(location) fetchWeather(location, true); // Refresh in background
    }, 10 * 60 * 1000); // every 10 minutes
    return () => clearInterval(intervalId);
  }, [location, fetchWeather]);
  
  const refreshWeather = useCallback(() => {
    if (location) {
        fetchWeather(location, true);
    }
  }, [location, fetchWeather]);

  const combinedWeatherData: WeatherData | null = weather && location ? {
    ...weather,
    locationName: location.name,
  } : null;

  return { weather: combinedWeatherData, isLoading, isRefreshing, error, refreshWeather };
};

export default useWeather;