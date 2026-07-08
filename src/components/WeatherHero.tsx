import { useWeather } from '../context/WeatherContext';
import { mapWeatherCode } from '../utils/weatherCodes';
import { type CurrentWeather } from '../services/api';
import { Star, Wind, Droplets, Gauge } from 'lucide-react';

interface WeatherHeroProps {
  current: CurrentWeather;
}

export function WeatherHero({ current }: WeatherHeroProps) {
  const { activeCity, toggleFavorite, isFavorite } = useWeather();
  
  if (!activeCity) return null;

  const { label, Icon } = mapWeatherCode(current.weather_code);
  const isFav = isFavorite(activeCity.id);

  // Dynamic greeting time text matching the mockup timestamp format
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="w-full bg-gradient-to-br from-[#16223f]/80 to-[#16223f]/30 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden shadow-xl">
      
      {/* Background Graphic Accent Element to copy the mockup layout aesthetics */}
      <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-10 translate-y-10">
        <Icon className="w-64 h-64 text-blue-400" />
      </div>

      {/* Header Info Section */}
      <div className="flex justify-between items-start z-10 relative">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              {activeCity.name}, <span className="text-slate-400 text-xl font-normal">{activeCity.country}</span>
            </h2>
            <button
              onClick={() => toggleFavorite(activeCity)}
              className="p-1.5 rounded-lg hover:bg-slate-800/40 text-slate-400 hover:text-yellow-400 transition"
              title={isFav ? "Remove from favorites" : "Add to favorites"}
            >
              <Star className={`w-6 h-6 transition-colors ${isFav ? 'fill-yellow-400 text-yellow-400' : ''}`} />
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-1">{formattedDate}</p>
        </div>

        {/* Visual Badge representing current condition */}
        <div className="flex flex-col items-center bg-slate-800/30 border border-slate-700/30 px-4 py-2 rounded-xl backdrop-blur-sm">
          <Icon className="w-10 h-10 text-blue-400 animate-pulse" />
          <span className="text-xs font-semibold text-slate-300 mt-1">{label}</span>
        </div>
      </div>

      {/* Central Temperature Breakdown Metrics */}
      <div className="my-8 z-10 relative">
        <div className="flex items-baseline text-white">
          <span className="text-6xl md:text-7xl font-extrabold tracking-tighter">
            {Math.round(current.temperature_2m)}
          </span>
          <span className="text-3xl font-light text-blue-400">°C</span>
        </div>
        <p className="text-sm text-slate-400 mt-1">
          Feels like <span className="text-slate-200 font-medium">{Math.round(current.apparent_temperature)}°C</span>
        </p>
      </div>

      {/* Bottom Horizontal Supplementary Metrics Row */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/60 z-10 relative">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
            <Wind className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Wind</span>
            <span className="text-sm font-semibold text-slate-200">{current.wind_speed_10m} km/h</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
            <Droplets className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Humidity</span>
            <span className="text-sm font-semibold text-slate-200">{current.relative_humidity_2m}%</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
            <Gauge className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Pressure</span>
            <span className="text-sm font-semibold text-slate-200">{Math.round(current.surface_pressure)} hPa</span>
          </div>
        </div>
      </div>

    </div>
  );
}