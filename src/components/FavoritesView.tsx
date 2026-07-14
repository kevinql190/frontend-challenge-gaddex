import { useState, useEffect } from 'react';
import { useWeather } from '../context/WeatherContext';
import { Star, CloudSun, Loader2 } from 'lucide-react';
import { fetchWeatherData, type CityResult } from '../services/api';
import { mapWeatherCode } from '../utils/weatherCodes';

interface FavoritesViewProps {
  onNavigateHome: () => void;
}

interface EnhancedFavorite extends CityResult {
  flagUrl: string;
  currentTemp: number;
  minTemp: number;
  maxTemp: number;
  weatherCode: number;
}

export function FavoritesView({ onNavigateHome }: FavoritesViewProps) {
  const { favorites, toggleFavorite, setActiveCity } = useWeather();
  const [enhancedFavs, setEnhancedFavs] = useState<EnhancedFavorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all live data concurrently when the view mounts
  useEffect(() => {
    const loadEnhancedData = async () => {
      if (favorites.length === 0) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const promises = favorites.map(async (city) => {
        const weather = await fetchWeatherData(city.latitude, city.longitude);
        
        // Flag CDN API
        const flagUrl = city.country_code 
          ? `https://flagcdn.com/w40/${city.country_code.toLowerCase()}.png`
          : '';

        return {
          ...city,
          flagUrl,
          currentTemp: Math.round(weather.current.temperature_2m),
          minTemp: Math.round(weather.daily.temperature_2m_min[0]),
          maxTemp: Math.round(weather.daily.temperature_2m_max[0]),
          weatherCode: weather.current.weather_code,
        };
      });
      
      const results = await Promise.all(promises);
      setEnhancedFavs(results);
      setIsLoading(false);
    };

    loadEnhancedData();
  }, [favorites]);

  const handleSelectCity = (city: CityResult) => {
    setActiveCity(city);
    onNavigateHome();
  };

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-slate-800 rounded-2xl bg-[#16223f]/10 px-4">
        <div className="p-4 mb-4 rounded-full bg-slate-800/40 text-slate-500">
          <CloudSun className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-300">No Saved Locations</h3>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">My Saved Locations</h2>
        <p className="text-sm text-slate-400">Live metrics for your tracked regions.</p>
      </div>

      <div className="bg-[#16223f]/50 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        
        {/* PC Header Row (Hidden on Mobile) */}
        <div className="hidden md:grid grid-cols-[40px_1fr_1fr_1fr_1fr_60px] gap-4 p-4 border-b border-slate-800/60 bg-slate-900/30 text-xs font-bold text-slate-400 uppercase tracking-wider items-center">
          <div>{/* Empty Image Header */}</div>
          <div>Location</div>
          <div>Current Condition</div>
          <div>Temperature</div>
          <div>Min / Max</div>
          <div className="text-center">{/* Empty Star Header */}</div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-blue-500">
            <Loader2 className="w-8 h-8 mb-2 animate-spin" />
            <span className="text-sm text-slate-400">Loading live data & images...</span>
          </div>
        ) : (
          /* Data Rows */
          <div className="divide-y divide-slate-800/60">
            {enhancedFavs.map((city) => {
              const { label, Icon } = mapWeatherCode(city.weatherCode);

              return (
                <div 
                  key={city.id}
                  onClick={() => handleSelectCity(city)}
                  className="cursor-pointer group hover:bg-slate-800/30 transition-colors p-4 md:p-4 grid grid-cols-[40px_1fr_40px_50px_40px] md:grid-cols-[40px_1fr_1fr_1fr_1fr_60px] gap-3 md:gap-4 items-center"
                >
                  {/* 1. Image */}
                  <img 
                    src={city.flagUrl} 
                    alt={city.country} 
                    className="object-cover w-8 h-6 border rounded-sm border-slate-700/50"
                  />
                  
                  {/* 2. Location */}
                  <div className="flex flex-col truncate">
                    <span className="text-sm font-bold text-white transition md:text-base group-hover:text-blue-400">
                      {city.name}
                    </span>
                    <span className="text-xs truncate text-slate-500">{city.country}</span>
                  </div>

                  {/* 3. Current Condition (Icon only on mobile, Icon + Text on PC) */}
                  <div className="flex items-center justify-end gap-2 overflow-hidden text-slate-300 md:justify-start">
                    <div title={label}>
                      <Icon className="w-5 h-5 text-blue-400 shrink-0" />
                    </div>
                    <span className="hidden text-sm truncate md:inline">{label}</span>
                  </div>

                  {/* 4. Temperature */}
                  <div className="text-base font-bold text-right text-white md:text-left md:text-lg">
                    {city.currentTemp}°
                  </div>

                  {/* 5. Min/Max (Hidden on Mobile) */}
                  <div className="items-center hidden gap-2 text-sm font-semibold md:flex">
                    <span className="text-slate-200">{city.maxTemp}°</span>
                    <span className="text-slate-600">/</span>
                    <span className="text-slate-500">{city.minTemp}°</span>
                  </div>

                  {/* 6. Star (Un-favorite) */}
                  <div className="flex justify-center md:justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(city);
                        // Optimistically remove from local state for immediate UI feedback
                        setEnhancedFavs(prev => prev.filter(c => c.id !== city.id));
                      }}
                      className="p-2 transition rounded-full hover:bg-slate-700/50"
                    >
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}