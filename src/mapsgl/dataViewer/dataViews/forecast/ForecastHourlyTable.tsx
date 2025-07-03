import { get, isNil } from '@aerisweather/javascript-utils';
import { useDataContext } from '@/providers/DataProvider';
import { calculateRangeMinMax, safeRound } from '@/utils/number';
import { DATA_VIEW_CONFIG } from '@/constants/forecast';
import {
    ForecastViewProps,
    DataResponse,
    SunMoonPeriod
} from '@/types/forecast';
import {
    isWindView,
    addSunsetSunriseTimes,
    getForecastPeriodValue,
    getRangeMaxValue
} from '@/utils/forecast';
import { convert, getSuffix, isPrecipitationOrSnowfall } from '@/utils/units';
import { useSettingsContext } from '@/providers/SettingsProvider';
import { DateDisplay } from '@/components/primitives/display/dateDisplay';
import { ColorRange } from '@/components/compositions/colorRange';
import { ForecastBaseTable } from './ForecastBaseTable';

export const ForecastHourlyTable = ({ dataView }: ForecastViewProps) => {
    const data = useDataContext();
    const { units } = useSettingsContext();
    const [forecastData, sunMoonData] = data?.map((x: {response: DataResponse}) => x.response) ?? [];
    const hourlyForecastPeriods = get(forecastData, '0.periods');

    if (isNil(hourlyForecastPeriods)) {
        return null;
    }

    const sunsetSunrisePeriods = sunMoonData.map((period: SunMoonPeriod) => period.sun);
    const mergedForecastPeriods = addSunsetSunriseTimes(hourlyForecastPeriods, sunsetSunrisePeriods);
    const { measurementType, apiKeyRoot, colorScaleTargetUnits } = DATA_VIEW_CONFIG[dataView];
    const suffix = getSuffix(measurementType, units[measurementType]);
    const expectedKey = `${apiKeyRoot.expected}${suffix}`;

    const { colorScale } = DATA_VIEW_CONFIG[dataView];

    const {
        rangeMin,
        rangeMax
    } = calculateRangeMinMax(hourlyForecastPeriods, expectedKey, expectedKey);

    const colorScaleUnitConverter = (value: number) => convert(
        measurementType,
        value,
        units[measurementType],
        colorScaleTargetUnits
    );

    return (
        <ForecastBaseTable
            periods={mergedForecastPeriods}
            dataView={dataView}
            dateDisplay={DateDisplay.Time}
            colorRange={(period) => {
                const expected = isPrecipitationOrSnowfall(measurementType)
                    ? getForecastPeriodValue(period, expectedKey)
                    : safeRound(getForecastPeriodValue(period, expectedKey));
                return (
                    <ColorRange
                        max={expected}
                        rangeMin={rangeMin ?? 0}
                        rangeMax={getRangeMaxValue(rangeMax, units[measurementType], measurementType)}
                        colorScale={colorScale}
                        colorScaleUnitConverter={colorScaleUnitConverter}>
                        <ColorRange.Bar maxSlot={
                            <>
                                <ColorRange.Circle size={[24, 16]} />
                                {
                                    <ColorRange.Label>{
                                        isWindView(dataView) && expected === 0
                                            ? 'Calm'
                                            : (((isPrecipitationOrSnowfall(measurementType))
                                                && expected === 0)
                                                ? ''
                                                : expected)
                                    }</ColorRange.Label>
                                }
                            </>
                        }/>
                    </ColorRange>
                );
            }}

        />
    );
};
