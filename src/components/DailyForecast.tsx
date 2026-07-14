import { useState } from 'react';
import { mapWeatherCode } from '../utils/weatherCodes';
import { type DailyForecast as DailyType } from '../services/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DailyForecastProps {
  daily: DailyType;
}

export function DailyForecast({ daily }: DailyForecastProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Perfect sizing to match design mockup grid flow

  const totalDays = daily.time.length;
  const totalPages = Math.ceil(totalDays / itemsPerPage);

  // Calculate array index boundaries for active window slicing
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Build a mapped structure of index numbers so we can step through neatly
  const pageIndices = Array.from({ length: totalDays }, (_, i) => i).slice(startIndex, endIndex);

  return (
    <div className="bg-[#16223f]/50 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold tracking-wider uppercase text-slate-400">
            30-Day Forecast
          </h3>
          <span className="text-xs font-medium text-slate-500">Total: {totalDays} Days</span>
        </div>

        {/* Data List rows layout block */}
        <div className="space-y-3">
          {pageIndices.map((index) => {
            const rawDate = daily.time[index];
            const maxTemp = daily.temperature_2m_max[index];
            const minTemp = daily.temperature_2m_min[index];
            const code = daily.weather_code[index];
            const { label, Icon } = mapWeatherCode(code);

            // Format date string beautifully (e.g. "Thu, May 30")
            const formattedDate = new Date(rawDate).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            });

            return (
              <div 
                key={rawDate}
                className="flex items-center justify-between p-3 bg-[#16223f]/40 border border-slate-800/40 rounded-xl text-sm transition hover:bg-slate-800/20"
              >
                <span className="w-24 font-medium text-slate-300">{formattedDate}</span>
                <div className="flex items-center flex-1 gap-2 px-4 text-slate-400">
                  <Icon className="w-5 h-5 text-blue-400 shrink-0" />
                  <span className="text-xs truncate max-w-[90px] hidden sm:inline">{label}</span>
                </div>
                <div className="flex items-center gap-3 font-semibold">
                  <span className="text-white">{Math.round(maxTemp)}°</span>
                  <span className="text-xs text-slate-500">{Math.round(minTemp)}°</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination Controls Footer Navigation Bar Component Layout */}
      <div className="flex items-center justify-center gap-2 pt-4 mt-6 border-t border-slate-800/60">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/40 disabled:opacity-30 disabled:pointer-events-none transition"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => setCurrentPage(pageNumber)}
            className={`w-8 h-8 rounded-lg text-xs font-bold border transition ${
              currentPage === pageNumber
                ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                : 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            {pageNumber}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/40 disabled:opacity-30 disabled:pointer-events-none transition"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}