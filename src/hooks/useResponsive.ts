import { useState, useCallback } from 'react';
import { getBreakpoint } from '@/utils/responsive';
import { useWindowResizeListener } from '@/hooks/useWindowResizeListener';

export const useResponsive = (delayInMilliseconds = 300) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [breakpoint, setBreakpoint] = useState(getBreakpoint(window.innerWidth));

    const handleResize = useCallback(() => {
        const newWidth = window.innerWidth;
        setWindowWidth(newWidth);
        setBreakpoint(getBreakpoint(newWidth));
    }, []);

    useWindowResizeListener(handleResize, delayInMilliseconds);

    return { windowWidth, breakpoint };
};
