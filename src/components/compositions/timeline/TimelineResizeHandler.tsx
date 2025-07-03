import { ReactNode, useCallback, useRef, useEffect } from 'react';
import { useTimelineContext } from '@/providers/TimelineProvider';
import { useWindowResizeListener } from '@/hooks/useWindowResizeListener';

export interface TimelineResizeHandlerProps {
    children: ReactNode;
    /** Time in milliseconds to wait after the last resize event before setting isResizing to false */
    debounceTime?: number;
}

/**
 * Manages window resize state for Timeline components by updating the shared isResizing state.
 * Sets isResizing to true when resize starts and false after resize events stop for debounceTime milliseconds.
 * Other Timeline components can use this state to optimize their rendering during resize operations.
 */
export const TimelineResizeHandler = ({
    children,
    debounceTime = 200
}: TimelineResizeHandlerProps) => {
    const { setIsResizing } = useTimelineContext();
    const resizeTimerRef = useRef<ReturnType<typeof setTimeout>>();
    const isResizingRef = useRef(false);

    const resetResizeState = useCallback(() => {
        if (resizeTimerRef.current) {
            clearTimeout(resizeTimerRef.current);
        }
        isResizingRef.current = false;
        setIsResizing(false);
    }, [setIsResizing]);

    const handleResize = useCallback(() => {
        if (!isResizingRef.current) {
            isResizingRef.current = true;
            setIsResizing(true);
        }

        if (resizeTimerRef.current) {
            clearTimeout(resizeTimerRef.current);
        }

        resizeTimerRef.current = setTimeout(resetResizeState, debounceTime);
    }, [debounceTime, resetResizeState, setIsResizing]);

    useEffect(() => () => resetResizeState(), [resetResizeState]);

    useWindowResizeListener(handleResize, 0);

    return children;
};

TimelineResizeHandler.displayName = 'TimelineResizeHandler';
