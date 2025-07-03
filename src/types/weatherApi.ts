import { WEATHER_API_ACTION } from '@/constants/weatherApi/action';
import { WEATHER_API_CONFIG } from '@/constants/weatherApi/config';

export type WeatherApiAction = typeof WEATHER_API_ACTION[keyof typeof WEATHER_API_ACTION];
export type WeatherApiConfig = typeof WEATHER_API_CONFIG;
export type WeatherApiEndpoint = keyof WeatherApiConfig;
