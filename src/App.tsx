import { useState } from 'react';
import { useWeather } from './context/WeatherContext';
import { CloudSun, Star, Map, Bell, Settings } from 'lucide-react';
import { SearchBar } from './components/SearchBar';

function App() {
  const { activeCity, favorites } = useWeather();
  const [currentView, setCurrentView] = useState<'home' | 'favorites'>('home');

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
              {activeCity && (
                <div className="text-xs text-slate-400 bg-[#16223f]/40 border border-slate-800 px-3 py-1.5 rounded-lg">
                  Active Tracking: <span className="text-blue-400 font-semibold">{activeCity.name}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Favorites Management View goes here next! */}
            <h2 className="text-2xl font-bold tracking-tight text-white">My Favorites</h2>
            <p className="text-slate-400 text-sm">Quick access to your saved locations.</p>
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