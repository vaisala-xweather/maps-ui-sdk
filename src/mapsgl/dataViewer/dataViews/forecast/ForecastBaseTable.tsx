import { ComponentType, ReactNode } from 'react';
import { DATA_VIEW_CONFIG } from '@/constants/forecast';
import { DataView, ForecastPeriod } from '@/types/forecast';
import { useSettingsContext } from '@/providers/SettingsProvider';
import { capitalizeWords } from '@/utils/text';
import { PanelList } from '@/components/primitives/layout/panel/PanelList';
import { DateDisplay } from '@/components/primitives/display/dateDisplay';
import { DateBaseProps } from '@/components/primitives/display/dateDisplay/DateBase';
import { HStack, VStack } from '@/components/primitives/layout/Stack';
import { Hr } from '@/components/primitives/layout/Hr';

interface ForecastBaseTableProps {
    periods: ForecastPeriod[];
    dataView: DataView;
    colorRange: (period: ForecastPeriod, index: number) => ReactNode;
    dateDisplay: ComponentType<Omit<DateBaseProps, 'children'>>;
}

interface SunriseSunsetBarProps {
    sunriseDateFormatted?: string | null;
    sunsetDateFormatted?: string | null;
}

interface ForecastUnitDescriptionBannerProps {
    dataView: DataView;
}

const PercentageText = ({ percent }: {percent: number | string | undefined}) => (
    <p className="xw-w-9 xw-text-slate-600 xw-shrink-0">
        {typeof percent === 'number' || typeof percent === 'string' ? `${percent}%` : 'N/A' }
    </p>
);

const ForecastUnitDescriptionBanner = ({ dataView }: ForecastUnitDescriptionBannerProps) => {
    const { units } = useSettingsContext();
    const { measurementType } = DATA_VIEW_CONFIG[dataView];

    return (
        <HStack className="xw-w-full xw-bg-slate-900 xw-px-1.5 xw-py-1 xw-text-white">
            {measurementType ? (
                `Weather / ${capitalizeWords(dataView)} (${units[measurementType]})`
            ) : (
                'Invalid Data View'
            )}
        </HStack>
    );
};

const SunriseSunsetBar = ({ sunriseDateFormatted, sunsetDateFormatted }: SunriseSunsetBarProps) => (
    (sunriseDateFormatted || sunsetDateFormatted)
        && <>
            <HStack className="xw-py-2 xw-items-center xw-w-full">
                <HStack className="xw-bg-slate-200 xw-w-full xw-px-1.5 xw-py-1">
                    {sunriseDateFormatted && <p className="xw-text-slate-500">
                    Sunrise {sunriseDateFormatted}
                    </p>}
                    {sunsetDateFormatted && <p className="xw-text-slate-500">
                    Sunset {sunsetDateFormatted}
                    </p>}
                </HStack>
            </HStack>
            <Hr className="xw-border-slate-200" />
        </>
);

export const ForecastBaseTable = ({
    periods,
    dataView,
    colorRange,
    dateDisplay
}: ForecastBaseTableProps) => {
    const DateDisplayComponent = dateDisplay;
    return (
        <>
            <ForecastUnitDescriptionBanner dataView={dataView} />
            <PanelList
                className="xw-overflow-x-hidden"
                dividerClassName="xw-border-slate-200"
                showLastDivider>
                {
                    periods?.map((period: ForecastPeriod, index: number) => (
                        <div key={index}>
                            {(period?.sunriseDateFormatted || period?.sunsetDateFormatted)
                            && <SunriseSunsetBar
                                sunriseDateFormatted={period?.sunriseDateFormatted}
                                sunsetDateFormatted={period?.sunsetDateFormatted}/>}
                            <HStack key={index} className="xw-py-2.5 xw-h-14 xw-items-center xw-gap-1">
                                {period?.dateTimeISO && <DateDisplay value={period?.dateTimeISO }>
                                    <VStack className="xw-w-10 xw-min-w-10 xw-max-w-10 xw-whitespace-nowrap xw-mr-1">
                                        <DateDisplay.DayShort />
                                        <DateDisplayComponent />
                                    </VStack>
                                </DateDisplay>}
                                <img
                                    className="xw-w-10 xw-min-w-10 xw-max-w-10"
                                    src={`https://cdn.aerisapi.com/wxblox/icons/${period?.icon || 'na.png'}`}
                                />
                                <PercentageText percent={period.pop} />
                                <div className="xw-relative xw-w-full">
                                    {colorRange(period, index)}
                                </div>
                            </HStack>
                        </div>
                    ))
                }
            </PanelList>
        </>
    );
};
