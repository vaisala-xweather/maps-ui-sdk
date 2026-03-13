export interface ForecastPrecipChanceProps {
    percent: number | string | undefined;
    className?: string;
}

export const ForecastPrecipChance = ({
    percent,
    className = 'xw-w-9 xw-text-slate-600 xw-shrink-0'
}: ForecastPrecipChanceProps) => (
    <p className={className}>
        {typeof percent === 'number' || typeof percent === 'string' ? `${percent}%` : 'N/A'}
    </p>
);

ForecastPrecipChance.displayName = 'Forecast.PrecipChance';
