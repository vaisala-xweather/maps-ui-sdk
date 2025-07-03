import { useState, useEffect } from 'react';
import { differenceInMilliseconds, startOfDay, minutesToMilliseconds, getHours, getMinutes } from 'date-fns';
import { useTimelineContext } from '@/providers/TimelineProvider';
import { TIME_INTERVALS } from '@/constants/timeIntervals';
import { sortByAscending } from '@/utils/array';
import { SliderTimes, TickData } from '@/types/timeline';

export interface UseTicksProps {
    /** Minimum pixels between ticks. Overrides density when provided */
    minSpacing?: number;
    /** Controls tick spacing: 'low' (40px), 'normal' (20px), 'high' (10px) */
    density?: 'low' | 'normal' | 'high';
}

const DENSITY_SPACING = {
    low: 40,
    normal: 20,
    high: 10
} as const;

/**
 * Detects daylight savings time changes between dates
 */
const isDSTChange = (date: Date, lastDate?: Date) => {
    if (!lastDate) return false;
    return date.getTimezoneOffset() !== lastDate.getTimezoneOffset();
};

/**
 * Calculates appropriate time unit (day, hour, minute etc.) based on timeline dimensions
 */
const calculateTimeUnit = (
    timeRangeInMilliseconds: number,
    width: number,
    spacing: number
) => {
    const units = sortByAscending(Object.values(TIME_INTERVALS));
    return units.find((interval) => width / (timeRangeInMilliseconds / interval) >= spacing) ?? TIME_INTERVALS.day;
};

/**
 * Calculates pixel offset for a tick based on its time position
 */
const calculateTickLeftOffset = (
    tickValue: number,
    fromTimeInMilliseconds: number,
    rangeInMilliseconds: number,
    trackWidth: number
) => {
    const progressInMilliseconds = differenceInMilliseconds(tickValue, fromTimeInMilliseconds);
    const percentComplete = progressInMilliseconds / rangeInMilliseconds;
    return percentComplete * trackWidth;
};

/**
 * Generates timeline tick marks with positions and metadata
 */
const generateTicks = (
    sliderTimes: SliderTimes,
    trackWidth: number,
    options: UseTicksProps = {}
): TickData[] => {
    const {
        minSpacing,
        density = 'normal'
    } = options;

    const spacing = minSpacing ?? DENSITY_SPACING[density];

    const { fromTimeInMilliseconds, toTimeInMilliseconds, rangeInMilliseconds } = sliderTimes;

    let tickInterval = calculateTimeUnit(rangeInMilliseconds, trackWidth, spacing);
    let tickValue = startOfDay(new Date(fromTimeInMilliseconds)).getTime();

    if (tickValue % tickInterval !== 0 && tickInterval % TIME_INTERVALS.day === 0) {
        tickValue += TIME_INTERVALS.day;
        tickInterval = TIME_INTERVALS.day;
    }

    let tickData: TickData[] = [];
    let initialTimeStampInMilliseconds;

    while (tickValue <= toTimeInMilliseconds) {
        if (initialTimeStampInMilliseconds === undefined && (tickValue + tickInterval) > fromTimeInMilliseconds) {
            initialTimeStampInMilliseconds = tickValue;
        }
        if (tickValue >= fromTimeInMilliseconds) {
            let date = new Date(tickValue);
            const previousTick = tickData.at(-1);

            // check if there's a Daylight Saving Time switch between dates of previous/current
            // tick and adjust the current date accordingly so we don't get weird period issues
            if (previousTick && isDSTChange(date, previousTick.date)) {
                const offsetDeltaInMinutes = date.getTimezoneOffset() - previousTick.date.getTimezoneOffset();
                tickValue += minutesToMilliseconds(offsetDeltaInMinutes);
                date = new Date(tickValue);
            }

            const isNewDay = getHours(new Date(tickValue)) + getMinutes(new Date(tickValue)) === 0;
            const leftOffset = calculateTickLeftOffset(
                tickValue,
                fromTimeInMilliseconds,
                rangeInMilliseconds,
                trackWidth
            );

            tickData.push({
                index: tickData.length,
                date: new Date(tickValue),
                isNewDay,
                leftOffset,
                availableSpace: 0
            });
        }
        tickValue += tickInterval;
    }

    if (initialTimeStampInMilliseconds === undefined) {
        return [];
    }

    // Calculate available space for each tick
    const newDaysCount = tickData.filter((tick) => tick.isNewDay).length;
    const firstNewDayOffset = tickData.find((tick) => tick.isNewDay)?.leftOffset ?? trackWidth;
    const spacePerDay = newDaysCount > 0 ? trackWidth / newDaysCount : trackWidth;

    tickData = tickData.map((tick, index) => {
        const isFirstTick = index === 0;
        const availableSpace = isFirstTick
            ? firstNewDayOffset
            : Math.min(trackWidth - tick.leftOffset, spacePerDay);

        return {
            ...tick,
            availableSpace
        };
    });

    return tickData;
};

/**
 * Hook for managing timeline tick marks.
 * Generates and updates ticks based on timeline dimensions and time range.
 */
export const useTicks = ({ minSpacing, density = 'normal' }: UseTicksProps): TickData[] | null => {
    const [ticks, setTicks] = useState<TickData[] | null>(null);
    const { sliderTimes, dimensions, startDate, endDate } = useTimelineContext();

    useEffect(() => {
        if (dimensions?.trackWidth) {
            const tickData = generateTicks(sliderTimes, dimensions.trackWidth, { minSpacing, density });
            setTicks(tickData);
        }
        /* eslint-disable react-hooks/exhaustive-deps */
    }, [sliderTimes, dimensions, startDate, endDate]);

    return ticks;
};
