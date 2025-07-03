import { ReactNode, createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { addDays, subDays } from 'date-fns';
import { SliderTimes } from '@/types/timeline';

interface Dimensions {
    trackWidth: number | null;
}

export interface TimelineProviderProps {
    children: ReactNode;
    startDate?: Date;
    endDate?: Date;
    /**
     * Current date corresponding to the indicator position.
     * Used for display purposes and time-based interactions.
     */
    currentDate?: Date;
    /**
     * Position of the indicator as a ratio (0-1) of total track width.
     */
    position: number;
    /** Callback fired when animation starts or resumes */
    onPlay: () => void;
    /** Callback fired when animation is paused */
    onPause: () => void;
    /**
     * Optional callback for date-based implementations.
     * Fired when the indicator moves to a new time.
     */
    onTimeChange?: (date: Date) => void;
    /**
     * Callback fired when indicator position changes.
     * Returns a normalized value between 0-1.
     */
    onPositionChange: (value: number) => void;
}

export interface TimelineContextProps {
    dimensions: Dimensions;
    startDate?: Date;
    endDate?: Date;
    currentDate?: Date;
    isPlaying: boolean;
    indicatorPosition: number | null;
    sliderTimes: SliderTimes;
    isResizing: boolean;
    nowPosition?: number;
    setDimensions: (dimensions: Dimensions) => void;
    setSliderTimes: (updatedSliderTimes: SliderTimes) => void;
    setIsResizing: (isResizing: boolean) => void;
    onAnimationControlClick: () => void;
    onPause: () => void;
    onDrag: (x: number) => void;
    onPositionChange: (x: number) => void;
    onNowPositionUpdate: () => void;
}

const defaultStartDate = subDays(new Date(), 1);
const defaultEndDate = addDays(new Date(), 1);
const defaultFromTimeInMilliseconds = defaultStartDate.getTime();
const defaultToTimeInMilliseconds = defaultEndDate.getTime();

export const TimelineContext = createContext<TimelineContextProps>({
    dimensions: { trackWidth: null },
    startDate: defaultStartDate,
    endDate: defaultEndDate,
    currentDate: defaultStartDate,
    isPlaying: false,
    indicatorPosition: null,
    sliderTimes: {
        fromTimeInMilliseconds: defaultFromTimeInMilliseconds,
        toTimeInMilliseconds: defaultToTimeInMilliseconds,
        rangeInMilliseconds: defaultToTimeInMilliseconds - defaultFromTimeInMilliseconds,
        startDate: defaultStartDate,
        endDate: defaultEndDate
    },
    isResizing: false,
    nowPosition: undefined,
    setDimensions: () => {},
    setSliderTimes: () => {},
    setIsResizing: () => {},
    onAnimationControlClick: () => {},
    onPause: () => {},
    onDrag: () => {},
    onPositionChange: () => {},
    onNowPositionUpdate: () => {}
});

export const useTimelineContext = () => {
    const context = useContext(TimelineContext);
    if (!context) {
        throw new Error('useTimelineContext must be used within a TimelineProvider');
    }
    return context;
};

export const TimelineProvider = ({
    children,
    startDate = defaultStartDate,
    endDate = defaultEndDate,
    currentDate,
    position,
    onPlay,
    onPause,
    onPositionChange,
    onTimeChange
}: TimelineProviderProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [dimensions, setDimensions] = useState<Dimensions>({ trackWidth: null });
    const [indicatorPosition, setIndicatorPosition] = useState<number | null>(null);
    const sliderTimes = useRef({
        startDate,
        endDate,
        fromTimeInMilliseconds: startDate.getTime(),
        toTimeInMilliseconds: endDate.getTime(),
        rangeInMilliseconds: endDate.getTime() - startDate.getTime()
    });
    const [isResizing, setIsResizing] = useState(false);
    const [nowPosition, onNowPositionUpdate] = useState<number | undefined>();

    const handleNowPositionUpdate = useCallback(() => {
        if (!dimensions.trackWidth) return;

        const nowDate = new Date();
        const timePassedInMilliseconds = nowDate.getTime() - sliderTimes.current.fromTimeInMilliseconds;
        const proportionTimePassedInMilliseconds = timePassedInMilliseconds / sliderTimes.current.rangeInMilliseconds;
        const calculatedPosition = Math.round(dimensions.trackWidth * proportionTimePassedInMilliseconds);

        onNowPositionUpdate(
            calculatedPosition >= 0 && calculatedPosition <= dimensions.trackWidth ? calculatedPosition : undefined
        );
    }, [dimensions.trackWidth]);

    useEffect(() => {
        handleNowPositionUpdate();
    }, [dimensions.trackWidth, startDate, endDate, handleNowPositionUpdate]);

    useEffect(() => {
        if (isPlaying) {
            handlePause();
        }

        const newSliderTimes = {
            startDate,
            endDate,
            fromTimeInMilliseconds: startDate.getTime(),
            toTimeInMilliseconds: endDate.getTime(),
            rangeInMilliseconds: endDate.getTime() - startDate.getTime()
        };
        setSliderTimes(newSliderTimes);
        /* eslint-disable react-hooks/exhaustive-deps */
    }, [startDate, endDate]);

    useEffect(() => {
        if (dimensions?.trackWidth && position !== undefined) {
            const pixelPosition = dimensions.trackWidth * position;
            setIndicatorPosition(pixelPosition);
        }
    }, [dimensions?.trackWidth, position]);

    const onAnimationControlClick = () => {
        if (isPlaying) {
            handlePause();
        } else {
            setIsPlaying(true);
            onPlay();
        }
    };

    const handlePause = () => {
        setIsPlaying(false);
        onPause();
    };

    const handleTimeIndicatorMovement = (x: number) => {
        if (isPlaying) {
            handlePause();
        }

        if (dimensions.trackWidth) {
            const normalizedPosition = x / dimensions.trackWidth;

            if (onTimeChange) {
                const { fromTimeInMilliseconds, rangeInMilliseconds } = sliderTimes.current;
                const timeDeltaInMilliseconds = rangeInMilliseconds * normalizedPosition;
                const newTime = new Date(fromTimeInMilliseconds + timeDeltaInMilliseconds);
                onTimeChange(newTime);
            }

            onPositionChange(normalizedPosition);
            setIndicatorPosition(x);
        }
    };

    const onDrag = (x: number) => {
        handleTimeIndicatorMovement(x);
    };

    const setSliderTimes = (updatedSliderTimes: SliderTimes) => {
        sliderTimes.current = updatedSliderTimes;
    };

    return (
        <TimelineContext.Provider
            value={{
                dimensions,
                setDimensions,
                sliderTimes: sliderTimes.current,
                setSliderTimes,
                startDate,
                endDate,
                currentDate,
                indicatorPosition,
                isPlaying,
                onDrag,
                onAnimationControlClick,
                onPause: handlePause,
                onPositionChange: handleTimeIndicatorMovement,
                isResizing,
                setIsResizing,
                nowPosition,
                onNowPositionUpdate: handleNowPositionUpdate
            }}
        >
            {children}
        </TimelineContext.Provider>
    );
};

TimelineProvider.displayName = 'Timeline.Provider';
