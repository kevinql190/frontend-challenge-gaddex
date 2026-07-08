import { useState, useEffect } from 'react';
import { useWeather } from '../context/WeatherContext';
import { fetchWeatherData, type WeatherData } from '../services/api';

export function useFetchWeather() {
  const { activeCity } = useWeather();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!activeCity) {
      setWeatherData(null);
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchWeatherData(activeCity.latitude, activeCity.longitude);
        setWeatherData(data);
      } catch (err) {
        setError('Failed to fetch weather forecast data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [activeCity]);

  return { weatherData, isLoading, error };
}