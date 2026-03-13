import { useSettingsContext } from '@/providers/SettingsProvider';
import { getOutlookText } from '@/utils/forecast';
import { useForecastContext } from './ForecastProvider';

export interface ForecastOutlookProps {
    className?: string;
}

export const ForecastOutlook = ({ className }: ForecastOutlookProps) => {
    const { units } = useSettingsContext();
    const {
        normalizedData: { outlook }
    } = useForecastContext();

    if (!outlook) {
        return null;
    }

    const outlookText = getOutlookText(outlook, units.temperature);

    return outlookText
        ? <p className={className}>{outlookText}</p>
        : null;
};

ForecastOutlook.displayName = 'Forecast.Outlook';
