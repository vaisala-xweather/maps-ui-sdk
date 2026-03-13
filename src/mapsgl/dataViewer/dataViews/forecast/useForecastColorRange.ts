import { useCallback, useMemo } from 'react';
import { safeRound } from '@/utils/number';
import { DATA_VIEW_CONFIG } from '@/constants/forecast';
import { ForecastPeriod } from '@/types/forecast';
import { ColorRangeRootProps } from '@/components/compositions/colorRange';
import {
    calculateForecastRangeMinMax,
    getForecastPeriodValue,
    getRangeMaxValue
} from '@/utils/forecast';
import { useSettingsContext } from '@/providers/SettingsProvider';
import { convert, getApiKey, isPrecipitationOrSnowfall } from '@/utils/units';
import type { ColorScaleStops } from '@/types/colors';
import type { ForecastDomainData } from './useForecastDomainData';

export interface ForecastColorRangeData {
    getColorRangeProps: (period: ForecastPeriod) => Omit<ColorRangeRootProps, 'children'>;
    colorScale: ColorScaleStops;
    colorScaleUnitConverter: (value: number) => number;
}

export function useForecastColorRange(
    domainData: ForecastDomainData | null
): ForecastColorRangeData | null {
    const { units } = useSettingsContext();

    const colorScaleUnitConverter = useCallback(
        (value: number) => {
            if (!domainData) return value;
            const { config } = domainData;
            return convert(
                config.measurementType,
                value,
                units[config.measurementType],
                config.colorScaleTargetUnits
            );
        },
        [domainData, units]
    );

    const rangeModeDerived = useMemo(() => {
        if (!domainData || domainData.valueMode !== 'range' || domainData.periods.length === 0) {
            return null;
        }
        const { config, periods, expectedKey } = domainData;
        const { apiKeyRoot, measurementType } = config;
        const minApiKey = apiKeyRoot.min ? getApiKey(apiKeyRoot.min, units) : null;
        const maxApiKey = apiKeyRoot.max ? getApiKey(apiKeyRoot.max, units) : null;
        const { rangeMin, rangeMax } = minApiKey && maxApiKey
            ? calculateForecastRangeMinMax(periods, minApiKey, maxApiKey)
            : { rangeMin: null, rangeMax: null };
        const expectedRange = calculateForecastRangeMinMax(periods, expectedKey, expectedKey);
        return {
            minApiKey,
            maxApiKey,
            rangeMin,
            rangeMax,
            expectedRangeMin: expectedRange.rangeMin,
            expectedRangeMax: expectedRange.rangeMax,
            measurementType
        };
    }, [domainData, units]);

    const singleModeDerived = useMemo(() => {
        if (!domainData || domainData.valueMode !== 'single' || domainData.periods.length === 0) {
            return null;
        }
        const { config, periods, expectedKey } = domainData;
        const { rangeMin, rangeMax } = calculateForecastRangeMinMax(periods, expectedKey, expectedKey);
        return { rangeMin, rangeMax, measurementType: config.measurementType };
    }, [domainData]);

    const getColorRangeProps = useCallback(
        (period: ForecastPeriod): Omit<ColorRangeRootProps, 'children'> => {
            if (!domainData) {
                return {
                    rangeMin: 0,
                    rangeMax: 0,
                    colorScale: DATA_VIEW_CONFIG.temperature.colorScale,
                    colorScaleUnitConverter
                };
            }
            const { config, valueMode: mode, expectedKey: expKey } = domainData;
            const { colorScale } = config;

            if (mode === 'range' && rangeModeDerived) {
                const {
                    minApiKey,
                    maxApiKey,
                    rangeMin,
                    rangeMax,
                    expectedRangeMin,
                    expectedRangeMax,
                    measurementType: mType
                } = rangeModeDerived;

                const base: Omit<ColorRangeRootProps, 'children'> = {
                    colorScaleUnitConverter,
                    colorScale,
                    rangeMin: 0,
                    rangeMax: 0,
                    min: 0,
                    max: 0
                };
                if (isPrecipitationOrSnowfall(mType)) {
                    return {
                        ...base,
                        max: getForecastPeriodValue(period, expKey),
                        rangeMin: expectedRangeMin ?? 0,
                        rangeMax: getRangeMaxValue(
                            expectedRangeMax,
                            units[mType],
                            mType
                        )
                    };
                }
                return {
                    ...base,
                    min: minApiKey ? safeRound(getForecastPeriodValue(period, minApiKey)) : 0,
                    max: maxApiKey ? safeRound(getForecastPeriodValue(period, maxApiKey)) : 0,
                    rangeMin: rangeMin ?? 0,
                    rangeMax: rangeMax ?? 0
                };
            }

            if (mode === 'single' && singleModeDerived) {
                const { rangeMin, rangeMax, measurementType: mType } = singleModeDerived;
                const expectedValue = isPrecipitationOrSnowfall(config.measurementType)
                    ? getForecastPeriodValue(period, expKey)
                    : safeRound(getForecastPeriodValue(period, expKey));
                return {
                    max: expectedValue,
                    rangeMin: rangeMin ?? 0,
                    rangeMax: getRangeMaxValue(rangeMax, units[mType], mType),
                    colorScale,
                    colorScaleUnitConverter
                };
            }

            return {
                rangeMin: 0,
                rangeMax: 0,
                colorScale,
                colorScaleUnitConverter
            };
        },
        [
            domainData,
            rangeModeDerived,
            singleModeDerived,
            units,
            colorScaleUnitConverter
        ]
    );

    if (!domainData) return null;

    return {
        getColorRangeProps,
        colorScale: domainData.config.colorScale,
        colorScaleUnitConverter
    };
}
