import { useEffect, useRef, useState, RefObject } from 'react';

export interface UseDimensionsReturn<T extends HTMLElement = HTMLDivElement> {
  ref: RefObject<T>;
  dimensions: DOMRect | null;
}

const haveDimensionsChanged = (
    previous: DOMRect | null,
    next: DOMRect
): boolean => {
    if (!previous) return true;

    return (previous.width !== next.width
    || previous.height !== next.height
    || previous.top !== next.top
    || previous.left !== next.left);
};

export const useDimensions = <T extends HTMLElement = HTMLDivElement>(
    targetElement?: T,
    observe = false
): UseDimensionsReturn<T> => {
    const ref = useRef<T | null>(null);
    const [dimensions, setDimensions] = useState<DOMRect | null>(null);

    useEffect(() => {
        const element = targetElement || ref.current;
        if (!element) return;

        const updateDimensions = () => {
            const newDimensions = element.getBoundingClientRect();
            setDimensions((previousDimensions) => {
                if (haveDimensionsChanged(previousDimensions, newDimensions)) {
                    return newDimensions;
                }
                return previousDimensions;
            });
        };

        updateDimensions();

        if (observe) {
            const resizeObserver = new ResizeObserver(() => updateDimensions());
            resizeObserver.observe(element);

            let mutationObserver: MutationObserver | null = null;
            if (element.parentElement) {
                mutationObserver = new MutationObserver(() => updateDimensions());
                mutationObserver.observe(element.parentElement, {
                    childList: true,
                    subtree: true,
                    attributes: true
                });
            }

            const abortController = new AbortController();
            const { signal } = abortController;

            window.addEventListener('resize', updateDimensions, { signal });
            window.addEventListener('scroll', updateDimensions, { signal });

            return () => {
                resizeObserver.disconnect();
                mutationObserver?.disconnect();
                abortController.abort();
            };
        }
    }, [observe, targetElement]);

    return { ref, dimensions };
};
