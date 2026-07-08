import { useState } from 'react';
import { useWeather } from './context/WeatherContext';
import { CloudSun, Star, Map, Bell, Settings } from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import { useFetchWeather } from './hooks/useFetchWeather';
import { WeatherHero } from './components/WeatherHero';
import { Loader2, Search } from 'lucide-react';
import { HourlyForecast } from './components/HourlyForecast';
import { DailyForecast } from './components/DailyForecast';
import { FavoritesView } from './components/FavoritesView';

function App() {
  const { activeCity, favorites } = useWeather();
  const [currentView, setCurrentView] = useState<'home' | 'favorites'>('home');
  const { weatherData, isLoading, error } = useFetchWeather();

  return (
    <div className="flex min-h-screen bg-[#0b1326] text-slate-100">
      
      {/* SIDEBAR - Desktop Grid View */}
      <aside className="w-64 bg-[#16223f]/40 border-r border-slate-800 p-6 flex flex-col justify-between hidden md:flex">
        <div className="space-y-8">
          {/* Logo Title Section */}
          <div className="flex items-center gap-3 px-2">
            <CloudSun className="w-8 h-8 text-blue-400" />
            <span className="font-bold text-xl tracking-tight">Weather</span>
          </div>

          {/* Navigation Menu Links */}
          <nav className="space-y-2">
            <button
              onClick={() => setCurrentView('home')}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition ${
                currentView === 'home' 
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <CloudSun className="w-5 h-5" />
              <span>Home</span>
            </button>

            <button
              onClick={() => setCurrentView('favorites')}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition ${
                currentView === 'favorites' 
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <Star className="w-5 h-5" />
              <span>Favorites</span>
              {favorites.length > 0 && (
                <span className="ml-auto bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {favorites.length}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Dummy Profile Section to match design */}
        <div className="flex items-center gap-3 p-2 bg-[#16223f]/60 rounded-xl border border-slate-800">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold text-sm">KG</div>
          <div>
            <p className="text-sm font-semibold text-white">Kevin G.</p>
            <p className="text-xs text-slate-400">Intern Mode</p>
          </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT COMPONENT CONTAINER */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full flex flex-col space-y-6 pb-24 md:pb-8">
        
        {currentView === 'home' ? (
          <div className="space-y-6">
            {/* Search Bar & Weather Viewports go here next! */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <SearchBar />
              {/* Empty Welcome State Viewport when no active city is selected */}
              {!isLoading && !weatherData && !error && (
                <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-slate-800 rounded-2xl bg-[#16223f]/10 px-4">
                  <div className="p-4 bg-slate-800/40 rounded-full text-slate-500 mb-4">
                    <Search className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-300">No City Tracked</h3>
                  <p className="text-sm text-slate-500 max-w-sm mt-1">
                    Please look up and select a city using the input search header above to view real-time climate conditions and 30-day extended analysis grids.
                  </p>
                </div>
              )}

              {/* Network Fetch Feedback State Managers */}
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-12 space-y-3">
                  <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                  <p className="text-sm text-slate-400 animate-pulse">Fetching fresh meteorological timelines...</p>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm text-center">
                  {error}
                </div>
              )}

              {/* Weather Presentation Grid layout */}
              {!isLoading && weatherData && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="lg:col-span-1">
                    <WeatherHero current={weatherData.current} />
                  </div>
                  <div className="lg:col-span-1 space-y-6">
                    <HourlyForecast hourly={weatherData.hourly} />
                    <DailyForecast daily={weatherData.daily} />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <FavoritesView onNavigateHome={() => setCurrentView('home')} />
          </div>
        )}

      </main>

      {/* MOBILE TAB BAR NAVIGATION (Fixes Mobile UX Layout smoothly) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#16223f]/90 backdrop-blur-md border-t border-slate-800 px-6 py-3 flex justify-around items-center md:hidden z-50">
        <button 
          onClick={() => setCurrentView('home')}
          className={`flex flex-col items-center gap-1 text-xs font-medium ${currentView === 'home' ? 'text-blue-400' : 'text-slate-500'}`}
        >
          <CloudSun className="w-5 h-5" />
          <span>Home</span>
        </button>
        <button 
          onClick={() => setCurrentView('favorites')}
          className={`flex flex-col items-center gap-1 text-xs font-medium relative ${currentView === 'favorites' ? 'text-blue-400' : 'text-slate-500'}`}
        >
          <Star className="w-5 h-5" />
          <span>Favorites</span>
          {favorites.length > 0 && (
            <span className="absolute -top-1 right-2 bg-blue-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
              {favorites.length}
            </span>
          )}
        </button>
      </nav>

    </div>
  );
}

export default App;