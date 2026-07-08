import { useState } from 'react';
import { searchCities, fetchWeatherData, type CityResult, type WeatherData } from './services/api';

function App() {
  const [query, setQuery] = useState('');
  const [cities, setCities] = useState<CityResult[]>([]);
  const [selectedCity, setSelectedCity] = useState<CityResult | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setSelectedCity(null);
    setWeather(null);
    
    try {
      const results = await searchCities(query);
      setCities(results);
      if (results.length === 0) setError('No cities found.');
    } catch (err) {
      setError('Error fetching cities.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCity = async (city: CityResult) => {
    setSelectedCity(city);
    setCities([]);
    setLoading(true);
    setError(null);

    try {
      const data = await fetchWeatherData(city.latitude, city.longitude);
      setWeather(data);
    } catch (err) {
      setError('Error fetching weather data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-white text-center">🌤️ Weather API Live Tester</h1>

      {/* Search Input */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type a city (e.g., Tokyo, London)..."
          className="flex-1 bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500"
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition">
          Search
        </button>
      </form>

      {/* Loading & Errors */}
      {loading && <p className="text-blue-400 text-center animate-pulse">Loading data from Open-Meteo...</p>}
      {error && <p className="text-red-400 text-center">{error}</p>}

      {/* City Results Dropdown List */}
      {cities.length > 0 && (
        <div className="bg-slate-800 rounded-lg p-2 border border-slate-700 mb-6">
          <p className="text-xs text-slate-400 px-3 py-1 font-semibold uppercase">Select a City:</p>
          {cities.map((city) => (
            <button
              key={city.id}
              onClick={() => handleSelectCity(city)}
              className="w-full text-left px-3 py-2 text-white hover:bg-slate-700 rounded transition flex justify-between"
            >
              <span>{city.name}, {city.country}</span>
              <span className="text-xs text-slate-400">Lat: {city.latitude.toFixed(2)} | Lon: {city.longitude.toFixed(2)}</span>
            </button>
          ))}
        </div>
      )}

      {/* Display Rendered Data */}
      {weather && selectedCity && (
        <div className="grid md:grid-cols-2 gap-6 bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <div>
            <h2 className="text-xl font-bold text-blue-400 mb-3">{selectedCity.name}, {selectedCity.country}</h2>
            <div className="bg-slate-800/80 rounded-lg p-4 space-y-2 text-sm text-slate-300">
              <p><strong className="text-white">Current Temp:</strong> {weather.current.temperature_2m}°C</p>
              <p><strong className="text-white">Feels Like:</strong> {weather.current.apparent_temperature}°C</p>
              <p><strong className="text-white">Humidity:</strong> {weather.current.relative_humidity_2m}%</p>
              <p><strong className="text-white">Wind Speed:</strong> {weather.current.wind_speed_10m} km/h</p>
              <p><strong className="text-white">WMO Weather Code:</strong> {weather.current.weather_code}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-400 mb-3">30-Day Extent Check</h3>
            <p className="text-xs text-slate-500 mb-2">Verifying past + future dataset counts:</p>
            <div className="bg-slate-800/80 rounded-lg p-4 text-sm text-slate-300 space-y-1">
              <p>🗓️ Total Daily Records: <span className="text-emerald-400 font-bold">{weather.daily.time.length} days</span></p>
              <p>⏰ Total Hourly Records: <span className="text-emerald-400 font-bold">{weather.hourly.time.length} timestamps</span></p>
              <p className="text-xs text-slate-500 pt-2 border-t border-slate-700">First recorded date: {weather.daily.time[0]}</p>
              <p className="text-xs text-slate-500">Last recorded date: {weather.daily.time[weather.daily.time.length - 1]}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;