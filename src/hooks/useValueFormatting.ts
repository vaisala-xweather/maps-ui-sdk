import { useMemo } from 'react';

/**
 * Hook for formatting numeric values
 */
export function useValueFormatting(
    value: number,
    formatter?: (value: number) => string | null | undefined
): string {
    return useMemo(() => {
        const customFormatted = formatter?.(value);
        return customFormatted == null ? value.toString() : customFormatted;
    }, [value, formatter]);
}
