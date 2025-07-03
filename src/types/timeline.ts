import { TIMELINE_POSITION } from '@/constants/timeline';

export interface TickData {
    index: number;
    /** The date/time this tick represents */
    date: Date;
    /** Whether this tick marks the start of a new day */
    isNewDay: boolean;
    /** Position in pixels from the start of the timeline track */
    leftOffset: number;
    /** Pixels available until the end of the timeline track */
    availableSpace: number;
}

export interface TimelineSpeed {
    value: number;
    label: string;
    selected: boolean;
}

export interface TimelineSettingsConfig {
    speeds: TimelineSpeed[];
}

export type TimelinePosition = (typeof TIMELINE_POSITION)[keyof typeof TIMELINE_POSITION];

export interface SliderTimes {
    startDate: Date;
    endDate: Date;
    fromTimeInMilliseconds: number;
    toTimeInMilliseconds: number;
    rangeInMilliseconds: number;
}
