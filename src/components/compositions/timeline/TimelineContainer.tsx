import { forwardRef, ReactNode } from 'react';
import clsx from 'clsx';
import { HStack } from '@/components/primitives/layout/Stack';

export interface TimelineContainerProps {
    children: ReactNode;
    className?: string;
}

export const TimelineContainer = forwardRef<HTMLDivElement, TimelineContainerProps>((props, ref) => {
    const { className, children } = props;

    return (
        <HStack
            ref={ref}
            className={clsx('xw-timeline-container xw-relative xw-items-center', className)}
        >
            {children}
        </HStack>
    );
});

TimelineContainer.displayName = 'Timeline.Container';
