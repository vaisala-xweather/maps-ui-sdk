import { ForecastPeriod } from '@/types/forecast';

const DEFAULT_ICON_BASE_URL = 'https://cdn.aerisapi.com/wxblox/icons';

export interface ForecastWeatherIconProps {
    period: ForecastPeriod;
    className?: string;
    iconBaseUrl?: string;
}

export const ForecastWeatherIcon = ({
    period,
    className = 'xw-w-10 xw-min-w-10 xw-max-w-10',
    iconBaseUrl = DEFAULT_ICON_BASE_URL
}: ForecastWeatherIconProps) => (
    <img
        className={className}
        src={`${iconBaseUrl}/${period?.icon || 'na.png'}`}
        alt={period?.weatherPrimary ?? 'Forecast icon'}
    />
);

ForecastWeatherIcon.displayName = 'Forecast.WeatherIcon';
