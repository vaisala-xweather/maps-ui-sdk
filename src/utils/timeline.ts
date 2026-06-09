/**
 * Returns the position of `Date.now()` within `[startDate, endDate]` as a 0–1 proportion,
 * or `undefined` if the range is incomplete or zero-width. Callers decide whether to
 * clamp, round, or reject values outside `[0, 1]`.
 */
export const computeNowProportion = (startDate?: Date, endDate?: Date): number | undefined => {
    if (!startDate || !endDate) return undefined;
    const fromMs = startDate.getTime();
    const rangeMs = endDate.getTime() - fromMs;
    if (rangeMs <= 0) return undefined;
    return (Date.now() - fromMs) / rangeMs;
};
