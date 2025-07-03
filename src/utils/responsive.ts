import { Responsive, ResponsiveObject, Breakpoint } from '@/types/responsive';
import { BREAKPOINT_ORDER, BREAKPOINTS } from '@/constants/responsive';

export const getBreakpoint = (width: number): Breakpoint => {
    if (width >= BREAKPOINTS.xxl.value) {
        return BREAKPOINTS.xxl.className;
    } if (width >= BREAKPOINTS.xl.value) {
        return BREAKPOINTS.xl.className;
    } if (width >= BREAKPOINTS.lg.value) {
        return BREAKPOINTS.lg.className;
    } if (width >= BREAKPOINTS.md.value) {
        return BREAKPOINTS.md.className;
    } if (width >= BREAKPOINTS.sm.value) {
        return BREAKPOINTS.sm.className;
    }
    return BREAKPOINTS.base.className;
};

export const isResponsiveObject = <T>(property: Responsive<T>): property is ResponsiveObject<T> => (
    typeof property === 'object' && property !== null && !Array.isArray(property)
);

export const resolveResponsiveProperty = <T>(
    property: Responsive<T>,
    breakpoint: Breakpoint
): T | undefined => {
    if (isResponsiveObject(property)) {
        const breakpointIndex = BREAKPOINT_ORDER.indexOf(breakpoint);

        for (let i = breakpointIndex; i >= 0; i--) {
            const bp = BREAKPOINT_ORDER[i];
            if (property[bp] !== undefined) {
                return property[bp];
            }
        }

        return undefined;
    }
    return property;
};
