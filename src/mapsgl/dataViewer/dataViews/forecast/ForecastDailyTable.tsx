import { get, isNil } from '@aerisweather/javascript-utils';
import { useDataContext } from '@/providers/DataProvider';
import { calculateRangeMinMax, safeRound } from '@/utils/number';
import { DATA_VIEW_CONFIG } from '@/constants/forecast';
import { ForecastViewProps, ForecastPeriod } from '@/types/forecast';
import {
    getForecastPeriodValue,
    getRangeMaxValue
} from '@/utils/forecast';
import { useSettingsContext } from '@/providers/SettingsProvider';
import { convert, getApiKey, getSuffix, isPrecipitationOrSnowfall } from '@/utils/units';
import { DateDisplay } from '@/components/primitives/display/dateDisplay';
import { ColorRange, ColorRangeRootProps } from '@/components/compositions/colorRange';
import { ForecastBaseTable } from './ForecastBaseTable';

export const ForecastDailyTable = ({ dataView }: ForecastViewProps) => {
    const data = useDataContext();
    const { units } = useSettingsContext();
    const dailyForecastPeriods = get(data, '0.periods');

    if (isNil(dailyForecastPeriods)) {
        return null;
    }

    const { measurementType, apiKeyRoot: { min, max, expected }, colorScaleTargetUnits } = DATA_VIEW_CONFIG[dataView];
    const minApiKey = min ? getApiKey(min, units) : null;
    const maxApiKey = max ? getApiKey(max, units) : null;
    const suffix = getSuffix(measurementType, units[measurementType]);
    const expectedKey = `${expected}${suffix}`;

    const {
        rangeMin,
        rangeMax
    } = calculateRangeMinMax(dailyForecastPeriods, minApiKey ?? 0, maxApiKey ?? 0);

    const {
        rangeMin: expectedRangeMin,
        rangeMax: expectedRangeMax
    } = calculateRangeMinMax(dailyForecastPeriods, expectedKey, expectedKey);

    const colorScaleUnitConverter = (value: number) => convert(
        measurementType,
        value,
        units[measurementType],
        colorScaleTargetUnits
    );

    const getColorRangeProps = (period: ForecastPeriod) => {
        const { colorScale } = DATA_VIEW_CONFIG[dataView];
        let props: Omit<ColorRangeRootProps, 'children'> = {
            colorScaleUnitConverter,
            colorScale,
            rangeMin: 0,
            rangeMax: 0,
            min: 0,
            max: 0
        };

        props = isPrecipitationOrSnowfall(measurementType) ? {
            ...props,
            max: getForecastPeriodValue(period, expectedKey),
            rangeMin: expectedRangeMin ?? 0,
            rangeMax: getRangeMaxValue(expectedRangeMax, units[measurementType], measurementType)
        } : {
            ...props,
            min: minApiKey ? safeRound(getForecastPeriodValue(period, minApiKey)) : 0,
            max: maxApiKey ? safeRound(getForecastPeriodValue(period, maxApiKey)) : 0,
            rangeMin: rangeMin ?? 0,
            rangeMax: rangeMax ?? 0
        };

        return props;
    };

    return (
        <ForecastBaseTable
            periods={dailyForecastPeriods}
            dataView={dataView}
            dateDisplay={DateDisplay.DateNumber}
            colorRange={(period) => {
                const props = getColorRangeProps(period);

                return (
                    <ColorRange {...getColorRangeProps(period)}>
                        {
                            isPrecipitationOrSnowfall(measurementType)
                                ? <ColorRange.Bar
                                    maxSlot={
                                        <>
                                            <ColorRange.Circle size={[16, 10]} />
                                            <ColorRange.Label>{
                                                props.max === 0 ? '' : max
                                            }</ColorRange.Label>
                                        </>
                                    }
                                />
                                : <ColorRange.Offset>
                                    <ColorRange.Gradient
                                        minSlot={ <>
                                            <ColorRange.Label/>
                                            <ColorRange.Circle size={[16, 10]} />
                                        </>

                                        }
                                        maxSlot={
                                            <>
                                                <ColorRange.Circle size={[16, 10]} />
                                                <ColorRange.Label />
                                            </>
                                        }
                                    />
                                </ColorRange.Offset>
                        }
                    </ColorRange>
                );
            }
            }>
        </ForecastBaseTable>
    );
};
