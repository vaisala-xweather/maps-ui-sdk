import { ForecastPeriod } from '@/types/forecast';
import { HStack } from '@/components/primitives/layout/Stack';

export interface ForecastSunriseSunsetBarProps {
    period: ForecastPeriod;
    className?: string;
}

export const ForecastSunriseSunsetBar = ({
    period,
    className = 'xw-py-2 xw-items-center xw-w-full'
}: ForecastSunriseSunsetBarProps) => {
    const { sunriseDateFormatted, sunsetDateFormatted } = period;

    if (!sunriseDateFormatted && !sunsetDateFormatted) {
        return null;
    }

    return (
        <HStack className={className}>
            <HStack className="xw-bg-slate-200 xw-w-full xw-px-1.5 xw-py-1">
                {sunriseDateFormatted && (
                    <p className="xw-text-slate-500">Sunrise {sunriseDateFormatted}</p>
                )}
                {sunsetDateFormatted && (
                    <p className="xw-text-slate-500">Sunset {sunsetDateFormatted}</p>
                )}
            </HStack>
        </HStack>
    );
};

ForecastSunriseSunsetBar.displayName = 'Forecast.SunriseSunsetBar';
