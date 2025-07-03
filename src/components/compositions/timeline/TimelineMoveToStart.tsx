import { forwardRef, MouseEvent } from 'react';
import { clsx } from 'clsx';
import { useTimelineContext } from '@/providers/TimelineProvider';
import { IconButton } from '@/components/primitives/buttons/IconButton';
import { IconButtonWithDefaultsProps } from '@/types/button';
import { LeftArrowIcon } from '@/components/compositions/icons/Icon';

export type TimelineMoveToStartProps = IconButtonWithDefaultsProps;

export const TimelineMoveToStart = forwardRef<HTMLButtonElement, TimelineMoveToStartProps>(({
    id = 'timeline-to-start',
    className,
    iconProps,
    onClick,
    ...rest
}, ref) => {
    const { onPositionChange } = useTimelineContext();

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        onPositionChange(0);
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
                'xw-timeline-move-to-start xw-justify-center xw-h-full',
                className
            )}
            icon={LeftArrowIcon}
            iconProps={mergedIconProps}
            onClick={handleClick}
            {...rest}
        />
    );
});

TimelineMoveToStart.displayName = 'TimelineMoveToStart';
