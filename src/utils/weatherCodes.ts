import { 
  Sun, 
  Cloud, 
  CloudFog, 
  CloudDrizzle, 
  CloudRain, 
  CloudSnow, 
  CloudLightning,
  HelpCircle,
  type LucideIcon 
} from 'lucide-react';

interface WeatherMapping {
  label: string;
  Icon: LucideIcon;
}

export function mapWeatherCode(code: number): WeatherMapping {
  // WMO Weather Interpretation Codes (WW)
  // https://open-meteo.com/en/docs
  if (code === 0) {
    return { label: 'Clear Sky', Icon: Sun };
  }
  
  if (code === 1 || code === 2 || code === 3) {
    return { label: 'Mainly Clear / Partly Cloudy', Icon: Cloud };
  }
  
  if (code === 45 || code === 48) {
    return { label: 'Foggy Conditions', Icon: CloudFog };
  }
  
  if (code === 51 || code === 53 || code === 55 || code === 56 || code === 57) {
    return { label: 'Drizzle', Icon: CloudDrizzle };
  }
  
  if (code === 61 || code === 63 || code === 65 || code === 66 || code === 67) {
    return { label: 'Rainy', Icon: CloudRain };
  }
  
  if (code === 71 || code === 73 || code === 75 || code === 77 || code === 85 || code === 86) {
    return { label: 'Snowfall', Icon: CloudSnow };
  }
  
  if (code === 80 || code === 81 || code === 82) {
    return { label: 'Rain Showers', Icon: CloudRain };
  }
  
  if (code >= 95 && code <= 99) {
    return { label: 'Thunderstorm', Icon: CloudLightning };
  }

  // Fallback map rule for undefined edge cases
  return { label: 'Unknown Sky', Icon: HelpCircle };
}