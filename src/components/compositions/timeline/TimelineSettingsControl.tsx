/* eslint-disable max-len */
import clsx from 'clsx';
import { addHours, format, differenceInHours } from 'date-fns';
import { TIMELINE_POSITION } from '@/constants/timeline';
import {
    TimelineSettingsConfig,
    TimelinePosition,
    SliderTimes
} from '@/types/timeline';
import { useTimelineContext } from '@/providers/TimelineProvider';
import { RadioGroup } from '@/components/primitives/controls/RadioGroup';
import { Button } from '@/components/primitives/buttons/Button';
import { Grid } from '@/components/primitives/layout/Grid';
import { MoveLeftIcon, MoveRightIcon, StopWatchIcon } from '@/components/compositions/icons/Icon';

type Dates = Record<TimelinePosition, Date>;
type TimeChangeInHoursFromNow = typeof timeChanges[number]['value'];
type TimeChangeLabel = typeof timeChanges[number]['label'];
type TimeRangeChangeDataByPosition = Record<TimelinePosition, TimeRangeCallbackData>;

interface TimeRangeCallbackData {
    callback: ((date: Date) => void) | undefined;
    key: keyof SliderTimes;
}

export interface TimelineSettingsControlProps {
    config?: TimelineSettingsConfig;
    onStartDateChange?: (date: Date) => void;
    onEndDateChange?: (value: Date) => void;
    onSpeedChange?: (value: number) => void;
}

export interface RangeButton {
    disabled: boolean;
    change: TimeChangeInHoursFromNow;
    label: TimeChangeLabel;
    onChange: () => void;
}

const timeChanges = [{
    value: -24,
    label: '-1 day'
}, {
    value: -1,
    label: '-1 hour'
}, {
    value: 1,
    label: '+1 hour'
}, {
    value: 24,
    label: '+1 day'
}] as const;

const resolveDates = (dates: { start: Date, end: Date }, position: TimelinePosition) => ({
    currentPositionDate: dates[position],
    otherPositionDate: dates[position === TIMELINE_POSITION.start ? TIMELINE_POSITION.end : TIMELINE_POSITION.start]
});

function calculateDifferenceInHours(dates: Dates, nextDate: Date, position: TimelinePosition) {
    return position === TIMELINE_POSITION.start
        ? differenceInHours(dates.end, nextDate)
        : differenceInHours(nextDate, dates.start);
}

const calculateDisabledStatus = (change: number, dates: Dates, position: TimelinePosition) => {
    const { currentPositionDate } = resolveDates(dates, position);
    const nextDate = addHours(currentPositionDate, change);
    const hoursDifference = calculateDifferenceInHours(dates, nextDate, position);
    return hoursDifference <= 0;
};

export const TimelineSettingsControl = ({
    config,
    onSpeedChange,
    onStartDateChange,
    onEndDateChange
}: TimelineSettingsControlProps) => {
    const baseButtonClassName = 'xw-w-full xw-border xw-py-1 xw-px-2 xw-whitespace-nowrap xw-text-xs xw-rounded xw-border-slate-200';
    const checkedButtonClassName = 'data-[state=checked]:xw-bg-slate-900 data-[state=checked]:xw-text-white';

    const {
        sliderTimes,
        setSliderTimes
    } = useTimelineContext();

    const dates = {
        start: new Date(sliderTimes.fromTimeInMilliseconds),
        end: new Date(sliderTimes.toTimeInMilliseconds)
    };

    const handleTimeRangeChange = (value: number, timelinePosition: TimelinePosition) => {
        const dataByPosition: TimeRangeChangeDataByPosition = {
            [TIMELINE_POSITION.start]: {
                callback: onStartDateChange,
                key: 'fromTimeInMilliseconds'
            },
            [TIMELINE_POSITION.end]: {
                callback: onEndDateChange,
                key: 'toTimeInMilliseconds'
            }
        };

        const data = dataByPosition[timelinePosition];
        const newDate = addHours(sliderTimes[data.key], value);

        if (data.callback) {
            data.callback(newDate);
        }

        let updatedSliderTimes = { ...sliderTimes, [data.key]: newDate.getTime() };
        const { fromTimeInMilliseconds, toTimeInMilliseconds } = updatedSliderTimes;

        updatedSliderTimes = {
            ...updatedSliderTimes,
            rangeInMilliseconds: toTimeInMilliseconds - fromTimeInMilliseconds
        };

        setSliderTimes(updatedSliderTimes);
    };

    const handleSpeedChange = (newSpeed: number) => {
        if (onSpeedChange) {
            onSpeedChange(newSpeed);
        }
    };

    return (
        <div className="xw-timeline-settings-control">
            <div className="xw-mb-4 xw-mt-5">
                <h3 className="xw-mb-2">Date Range</h3>
                <div className="xw-flex xw-items-center xw-text-xs xw-mb-1">
                    <MoveLeftIcon className="xw-mr-2" />
                    <h4 className="xw-font-semibold">Start</h4>
                    <p className="xw-text-center xw-ml-auto">
                        {format(dates.start, 'MM/dd/yyyy h:mma').toLowerCase()}
                    </p>
                </div>
                <Grid itemsPerRow={4} gap={4}>
                    {timeChanges.map((option) => (
                        <Button
                            key={option.value}
                            className={baseButtonClassName}
                            disabled={calculateDisabledStatus(option.value, dates, TIMELINE_POSITION.start)}
                            onClick={() => handleTimeRangeChange(option.value, TIMELINE_POSITION.start)}

                        >
                            {option.label}
                        </Button>
                    ))}
                </Grid>
            </div>

            <div className="xw-flex xw-items-center xw-text-xs xw-mb-1">
                <MoveRightIcon className="xw-mr-2" />
                <h4 className="xw-font-semibold">End</h4>
                <p className="xw-text-center xw-ml-auto">
                    {format(dates.end, 'MM/dd/yyyy h:mma').toLowerCase()}
                </p>
            </div>
            <Grid itemsPerRow={4} gap={4}>
                {timeChanges.map((option) => (
                    <Button
                        key={option.value}
                        className={baseButtonClassName}
                        disabled={calculateDisabledStatus(option.value, dates, TIMELINE_POSITION.end)}
                        onClick={() => handleTimeRangeChange(option.value, TIMELINE_POSITION.end)}
                    >
                        {option.label}
                    </Button>
                ))}
            </Grid>

            {
                config?.speeds
                    && <>
                        <p className="xw-text-2xs xw-text-help xw-mt-2">
                            Shift the start/end times by adding or removing hour or day intervals.
                        </p>
                        <hr className="xw-opacity-25 xw-my-2" />
                        <h3 className="xw-mb-2">Animation</h3>
                        <p className="xw-font-semibold xw-mb-1 xw-text-xs xw-flex">
                            <StopWatchIcon className="xw-mr-2" />
                            Speed
                        </p>
                        <RadioGroup
                            value={config?.speeds?.find((x) => x.selected)?.value?.toString() ?? '1'}
                            onValueChange={(value) => handleSpeedChange(Number(value))}
                        >
                            <Grid itemsPerRow={4} gap={4}>
                                {config.speeds.map((speed) => (
                                    <RadioGroup.Item
                                        key={speed.value}
                                        value={speed.value.toString()}
                                        className={clsx(baseButtonClassName, checkedButtonClassName)}
                                    >
                                        {speed.label}
                                    </RadioGroup.Item>
                                ))}
                            </Grid>
                        </RadioGroup>
                    </>
            }
        </div>
    );
};

TimelineSettingsControl.displayName = 'Timeline.SettingsControl';
