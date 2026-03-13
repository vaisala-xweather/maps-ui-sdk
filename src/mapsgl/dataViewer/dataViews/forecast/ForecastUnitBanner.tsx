import { ForecastDataView } from '@/types/forecast';
import { DATA_VIEW_CONFIG } from '@/constants/forecast';
import { useSettingsContext } from '@/providers/SettingsProvider';
import { capitalizeWords } from '@/utils/text';
import { HStack } from '@/components/primitives/layout/Stack';

export interface ForecastUnitBannerProps {
    dataView: ForecastDataView;
    className?: string;
}

export const ForecastUnitBanner = ({
    dataView,
    className = 'xw-w-full xw-bg-slate-900 xw-px-1.5 xw-py-1 xw-text-white'
}: ForecastUnitBannerProps) => {
    const { units } = useSettingsContext();
    const { measurementType } = DATA_VIEW_CONFIG[dataView];

    return (
        <HStack className={className}>
            {measurementType
                ? `Weather / ${capitalizeWords(dataView)} (${units[measurementType]})`
                : 'Invalid Data View'}
        </HStack>
    );
};

ForecastUnitBanner.displayName = 'Forecast.UnitBanner';
