import { useEffect } from 'react';
import { debounce } from '@/utils/debounce';

export const useWindowResizeListener = (callback: () => void, delayInMilliseconds: number) => {
    useEffect(() => {
        const handleResize = debounce(callback, delayInMilliseconds);
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [callback, delayInMilliseconds]);
};
