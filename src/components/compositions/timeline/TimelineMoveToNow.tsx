import { forwardRef, useState, useEffect, MouseEventHandler } from 'react';
import { clsx } from 'clsx';
import { useTimeInterval } from '@/hooks/useTimeInterval';
import { useTimelineContext } from '@/providers/TimelineProvider';
import { IconButton } from '@/components/primitives/buttons/IconButton';
import { IconButtonWithDefaultsProps } from '@/types/button';
import { THEME } from '@/constants/theme';
import { TriangleIcon } from '@/components/compositions/icons/Icon';

/**
 * Calculates the current time position on the timeline.
 * Returns undefined if current time falls outside the timeline bounds or if container width is invalid.
 */
const getNowPosition = (
    containerWidth: number | null,
    fromTimeInMilliseconds: number,
    rangeInMilliseconds: number
): number | undefined => {
    if (!containerWidth) return undefined;

    const nowDate = new Date();
    const timePassedInMilliseconds = nowDate.getTime() - fromTimeInMilliseconds;
    const proportionTimePassedInMilliseconds = timePassedInMilliseconds / rangeInMilliseconds;
    const position = Math.round(containerWidth * proportionTimePassedInMilliseconds);
    return position >= 0 && position <= containerWidth ? position : undefined;
};

export type TimelineMoveToNowProps = IconButtonWithDefaultsProps;

export const TimelineMoveToNow = forwardRef<HTMLButtonElement, TimelineMoveToNowProps>(({
    id = 'timeline-to-now',
    className,
    iconProps,
    onClick,
    children,
    icon = TriangleIcon,
    style,
    ...rest
}, ref) => {
    const {
        onPositionChange,
        nowPosition,
        onNowPositionUpdate
    } = useTimelineContext();

    useTimeInterval(onNowPositionUpdate, 60000);

    if (typeof nowPosition !== 'number') return null;

    const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
        event.stopPropagation();
        onPositionChange(nowPosition);
        onClick?.(event);
    };

    const mergedIconProps = {
        size: 16,
        color: THEME.colors['secondary-200'],
        ...iconProps
    };

    return (
        <IconButton
            ref={ref}
            id={id}
            className={clsx('xw-timeline-move-to-now xw-absolute xw-transform xw--translate-x-1/2', className)}
            icon={icon}
            iconProps={mergedIconProps}
            style={{
                left: nowPosition,
                ...style
            }}
            onClick={handleClick}
            {...rest}
        >
            {children}
        </IconButton>
    );
});
TimelineMoveToNow.displayName = 'Timeline.MoveToNow';
