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
    return null;
};

const LOCATION_STORAGE_KEY = 'radio520_weather_location';

/**
 * Attempts to get a city name from coordinates using multiple geocoding services.
 */
const reverseGeocode = async (lat: number, lon: number): Promise<string | null> => {
    // Attempt 1: Open-Meteo
    try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=pt`);
        if (!response.ok) {
            throw new Error(`Open-Meteo API failed with status: ${response.status}`);
        }
        const data = await response.json();
        const locationName = data.name || data.city || data.admin4 || data.admin3 || data.admin2;
        if (locationName) {
            return locationName;
        }
        console.warn("Open-Meteo did not return a valid location name.", data);
    } catch (error) {
        console.warn("Reverse geocoding with Open-Meteo failed, trying fallback.", error);
    }

    // Attempt 2: Nominatim (OpenStreetMap)
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`, {
            headers: { 'Accept-Language': 'pt-BR,pt;q=0.9' }
        });
        if (!response.ok) {
            throw new Error(`Nominatim API failed with status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.address) {
            const locationName = data.address.city || data.address.town || data.address.village || data.address.county || data.address.state;
            if (locationName) return locationName;
        }
        console.warn("Nominatim did not return a valid location name.", data);
    } catch (error) {
        console.error("Reverse geocoding with Nominatim also failed.", error);
    }

    return null;
};

/**
 * Attempts to get location from user's IP address using multiple services.
 */
const getIpBasedLocation = async (): Promise<Location> => {
    // Attempt 1: ipinfo.io (often more reliable with ad-blockers)
    try {
        const response = await fetch('https://ipinfo.io/json');
        if (!response.ok) throw new Error(`ipinfo.io status: ${response.status}`);
        const data = await response.json();
        if (typeof data === 'object' && data !== null && data.city && data.loc) {
            const [lat, lon] = data.loc.split(',').map(Number);
            return { name: data.city, latitude: lat, longitude: lon };
        }
        throw new Error('ipinfo.io returned invalid response');
    } catch (error) {
        console.warn("IP geolocation via ipinfo.io failed. Trying next provider.", error);
    }

    // Attempt 2: ip-api.com
    try {
        const response = await fetch('https://ip-api.com/json/?fields=status,message,city,lat,lon');
        if (!response.ok) throw new Error(`ip-api.com status: ${response.status}`);
        const data = await response.json();
        if (typeof data === 'object' && data !== null && data.status === 'success' && data.city) {
            return { name: data.city, latitude: data.lat, longitude: data.lon };
        }
        throw new Error(`ip-api.com error: ${data.message || 'Invalid response'}`);
    } catch (error) {
        console.warn("IP geolocation via ip-api.com failed. Using final fallback.", error);
    }

    // Final fallback
    console.log("Both IP geolocation providers failed. Using São Paulo as a fallback location.");
    return { name: 'São Paulo', latitude: -23.5505, longitude: -46.6333 };
};


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

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    const cityName = await reverseGeocode(latitude, longitude);
                    if (cityName) {
                        saveLocation({ name: cityName, latitude, longitude });
                    } else {
                        // If reverse geocoding fails, fallback to IP-based location
                        const ipLocation = await getIpBasedLocation();
                        saveLocation(ipLocation);
                    }
                },
                async (error) => {
                    console.warn(`Geolocation error (${error.code}): ${error.message}`);
                    const ipLocation = await getIpBasedLocation();
                    saveLocation(ipLocation);
                },
                {
                    enableHighAccuracy: false,
                    timeout: 15000,
                    maximumAge: 60000,
                }
            );
        } else {
            console.warn("Geolocation not supported by this browser.");
            const ipLocation = await getIpBasedLocation();
            saveLocation(ipLocation);
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