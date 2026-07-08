import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type CityResult } from '../services/api';

interface WeatherContextType {
  activeCity: CityResult | null;
  setActiveCity: (city: CityResult | null) => void;
  favorites: CityResult[];
  toggleFavorite: (city: CityResult) => void;
  isFavorite: (id: number) => boolean;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider = ({ children }: { children: ReactNode }) => {
  const [activeCity, setActiveCity] = useState<CityResult | null>(null);
  
  // Initialize favorites from localStorage[cite: 1]
  const [favorites, setFavorites] = useState<CityResult[]>(() => {
    const saved = localStorage.getItem('weather-favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync favorites to localStorage whenever they change[cite: 1]
  useEffect(() => {
    localStorage.setItem('weather-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (city: CityResult) => {
    setFavorites((prev) => 
      prev.find((f) => f.id === city.id)
        ? prev.filter((f) => f.id !== city.id)
        : [...prev, city]
    );
  };

  const isFavorite = (id: number) => favorites.some((f) => f.id === id);

  return (
    <WeatherContext.Provider value={{ activeCity, setActiveCity, favorites, toggleFavorite, isFavorite }}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) throw new Error('useWeather must be used within a WeatherProvider');
  return context;
};