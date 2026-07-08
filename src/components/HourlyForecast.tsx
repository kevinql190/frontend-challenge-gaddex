import { mapWeatherCode } from '../utils/weatherCodes';
import { type HourlyForecast as HourlyType } from '../services/api';

interface HourlyForecastProps {
  hourly: HourlyType;
}

export function HourlyForecast({ hourly }: HourlyForecastProps) {
  // Take only the first 24 hours from the dataset to show a single day loop
  const next24Hours = hourly.time.slice(0, 24);

  return (
    <div className="bg-[#16223f]/50 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-xl">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
        Hourly Forecast
      </h3>
      
      {/* We use overflow-x-auto and hide the scrollbar to get a perfect native swipe row */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x select-none">
        {next24Hours.map((timeString, index) => {
          const temp = hourly.temperature_2m[index];
          const code = hourly.weather_code[index];
          const { label, Icon } = mapWeatherCode(code);
          
          // Format "2025-06-01T08:00" into a simple "08:00" reader string
          const hourText = timeString.split('T')[1];

          return (
            <div 
              key={timeString} 
              className="flex flex-col items-center justify-between min-w-[70px] bg-[#16223f]/40 border border-slate-800/60 rounded-xl py-3 px-2 snap-bleed transition hover:border-slate-700/50"
            >
              <span className="text-xs font-semibold text-slate-400">{hourText}</span>
              <div title={label}>
                <Icon className="w-6 h-6 text-blue-400 my-3" />
              </div>
              <span className="text-sm font-bold text-white">{Math.round(temp)}°</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}