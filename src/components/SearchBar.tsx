import { useState, useEffect, useRef } from 'react';
import { Search, Loader2, MapPin } from 'lucide-react';
import { searchCities, type CityResult } from '../services/api';
import { useWeather } from '../context/WeatherContext';

export function SearchBar() {
  const { setActiveCity } = useWeather();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<CityResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced API call handling[cite: 1]
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setError(null);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const results = await searchCities(query);
        setSuggestions(results);
        if (results.length === 0) {
          setError('No cities found matching your search.');
        }
      } catch (err) {
        setError('Failed to fetch cities. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }, 400); // 400ms delay to prevent network spamming

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Close dropdown when clicking outside the input area
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: CityResult) => {
    setActiveCity(city);
    setQuery('');
    setSuggestions([]);
  };

  return (
    <div ref={dropdownRef} className="relative w-full max-w-xl z-30">
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a city or country..."
          className="w-full bg-[#16223f]/60 backdrop-blur-md text-white pl-12 pr-12 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500/50 transition placeholder:text-slate-500 text-sm"
        />
        {isLoading && (
          <Loader2 className="absolute right-4 w-5 h-5 text-blue-400 animate-spin" />
        )}
      </div>

      {/* Floating Suggestions Dropdown */}
      {(suggestions.length > 0 || error) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#16223f]/95 backdrop-blur-lg border border-slate-800 rounded-xl overflow-hidden shadow-2xl z-40">
          {error ? (
            <div className="p-4 text-xs text-slate-400 text-center">{error}</div>
          ) : (
            <div className="py-2">
              <p className="text-[10px] text-slate-500 px-4 py-1 font-bold uppercase tracking-wider">
                Search Suggestions
              </p>
              {suggestions.map((city) => (
                <button
                  key={city.id}
                  onClick={() => handleSelect(city)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800/40 text-left transition group"
                >
                  <MapPin className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-200 group-hover:text-white">
                      {city.name}
                    </span>
                    <span className="text-xs text-slate-400">
                      {city.country} {city.country_code ? `(${city.country_code})` : ''}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}