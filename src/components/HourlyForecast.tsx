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
      <h3 className="mb-4 text-sm font-bold tracking-wider uppercase text-slate-400">
        Hourly Forecast
      </h3>
      
      {/* We use overflow-x-auto and hide the scrollbar to get a perfect native swipe row */}
      <div className="flex gap-4 pb-2 overflow-x-auto select-none scrollbar-none snap-x">
        {next24Hours.map((timeString, index) => {
          const temp = hourly.temperature_2m[index];
          const code = hourly.weather_code[index];
          const { label, Icon } = mapWeatherCode(code);
          
          // Format "2025-06-01T08:00" into a simple "08:00" reader string
          const hourText = timeString.split('T')[1];

          return (
            <div 
              key={timeString} 
              className="flex flex-col items-center justify-between transition min-w-12 snap-bleed hover:border-slate-700/50"
            >
              <span className="text-xs font-semibold text-slate-400">{hourText}</span>
              <div title={label}>
                <Icon className="w-6 h-6 my-3 text-blue-400" />
              </div>
              <span className="text-sm font-bold text-white">{Math.round(temp)}°</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}