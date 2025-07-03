import { useEffect } from 'react';

export const useTimeInterval = (callback: () => void, timeInMilliseconds: number, sync = true) => {
    useEffect(() => {
        let intervalId: number;
        let timeoutId: number;

        if (sync) {
            const now = Date.now();
            const delay = timeInMilliseconds - (now % timeInMilliseconds);

            timeoutId = window.setTimeout(() => {
                callback();
                intervalId = window.setInterval(callback, timeInMilliseconds);
            }, delay);
        } else {
            intervalId = window.setInterval(callback, timeInMilliseconds);
        }

        return () => {
            window.clearInterval(intervalId);
            window.clearTimeout(timeoutId);
        };
    }, [callback, timeInMilliseconds, sync]);
};
