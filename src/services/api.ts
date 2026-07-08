// --- Types for Geocoding API ---
export interface CityResult {
  id: number;
  name: string;
  country: string;
  country_code: string;
  latitude: number;
  longitude: number;
}

interface GeocodingResponse {
  results?: CityResult[];
}

// --- Types for Forecast API ---[cite: 1]
export interface CurrentWeather {
  temperature_2m: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  surface_pressure: number;
  wind_speed_10m: number;
  weather_code: number;
}

export interface HourlyForecast {
  time: string[];
  temperature_2m: number[];
  weather_code: number[];
}

export interface DailyForecast {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  weather_code: number[];
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecast;
  daily: DailyForecast;
}

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Searches for a city by name[cite: 1]
 */
export const searchCities = async (name: string): Promise<CityResult[]> => {
  if (!name || name.trim().length < 2) return [];
  
  const response = await fetch(
    `${GEOCODING_BASE_URL}?name=${encodeURIComponent(name)}&count=5&language=en`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch city search results');
  }
  
  const data: GeocodingResponse = await response.json();
  return data.results || [];
};

/**
 * Fetches the 30-day forecast, hourly data, and current conditions for a location[cite: 1]
 */
export const fetchWeatherData = async (lat: number, lon: number): Promise<WeatherData> => {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: 'temperature_2m,apparent_temperature,relative_humidity_2m,surface_pressure,wind_speed_10m,weather_code',
    hourly: 'temperature_2m,weather_code',
    daily: 'temperature_2m_max,temperature_2m_min,weather_code',
    forecast_days: '16', // Maximum supported future days by Open-Meteo[cite: 1]
    past_days: '14',      // Combined with 16 days gives us a full 30-day view[cite: 1]
    timezone: 'auto'
  });

  const response = await fetch(`${FORECAST_BASE_URL}?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }

  return response.json();
};