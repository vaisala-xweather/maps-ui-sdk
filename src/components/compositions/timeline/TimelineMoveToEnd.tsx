import { forwardRef, MouseEvent } from 'react';
import { clsx } from 'clsx';
import { useTimelineContext } from '@/providers/TimelineProvider';
import { IconButton } from '@/components/primitives/buttons/IconButton';
import { IconButtonWithDefaultsProps } from '@/types/button';
import { RightArrowIcon } from '@/components/compositions/icons/Icon';

export type TimelineMoveToEndProps = IconButtonWithDefaultsProps;

export const TimelineMoveToEnd = forwardRef<HTMLButtonElement, TimelineMoveToEndProps>(({
    id = 'timeline-to-end',
    className,
    iconProps,
    onClick,
    ...rest
}, ref) => {
    const { onPositionChange, dimensions } = useTimelineContext();

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        const newPosition = dimensions?.trackWidth;
        if (newPosition) {
            onPositionChange(newPosition);
        }
        onClick?.(event);
    };

    const mergedIconProps = {
        size: 14,
        ...iconProps
    };

    return (
        <IconButton
            ref={ref}
            id={id}
            className={clsx(
                'xw-timeline-move-to-end xw-justify-center xw-h-full',
                className
            )}
            icon={RightArrowIcon}
            iconProps={mergedIconProps}
            onClick={handleClick}
            {...rest}
        />
    );
});

TimelineMoveToEnd.displayName = 'Timeline.MoveToEnd';
