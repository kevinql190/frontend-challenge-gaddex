import { useWeather } from '../context/WeatherContext';
import { Trash2, MapPin, ExternalLink, CloudSun } from 'lucide-react';
import { type CityResult } from '../services/api';

interface FavoritesViewProps {
  onNavigateHome: () => void;
}

export function FavoritesView({ onNavigateHome }: FavoritesViewProps) {
  const { favorites, toggleFavorite, setActiveCity } = useWeather();

  const handleSelectCity = (city: CityResult) => {
    setActiveCity(city);
    onNavigateHome(); // Smoothly jump back to home layout dashboard view
  };

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-slate-800 rounded-2xl bg-[#16223f]/10 px-4">
        <div className="p-4 bg-slate-800/40 rounded-full text-slate-500 mb-4">
          <CloudSun className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-300">No Saved Locations</h3>
        <p className="text-sm text-slate-500 max-w-sm mt-1">
          You haven't starred any cities yet. Search for your favorite locations on the dashboard and click the star icon to track them here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">My Saved Locations</h2>
        <p className="text-slate-400 text-sm">Quickly hop between your preferred regional monitoring nodes.</p>
      </div>

      {/* Grid Display of Saved Locations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map((city) => (
          <div 
            key={city.id} 
            className="bg-[#16223f]/50 backdrop-blur-md border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-lg hover:border-slate-700/50 transition group"
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400 h-fit">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg group-hover:text-blue-400 transition-colors">
                    {city.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {city.country} {city.country_code ? `(${city.country_code})` : ''}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono mt-2">
                    Lat: {city.latitude.toFixed(2)} | Lon: {city.longitude.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Remove Favorite Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Avoid triggering full card selection logic
                  toggleFavorite(city);
                }}
                className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition"
                title="Remove location"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Action Navigation Button */}
            <button
              onClick={() => handleSelectCity(city)}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-[#16223f]/80 border border-slate-800 text-xs font-semibold text-slate-300 py-2.5 rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-500 transition shadow-inner group-hover:border-slate-700/60"
            >
              <span>View Live Forecast</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}