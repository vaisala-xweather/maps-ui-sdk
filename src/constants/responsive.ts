export const BREAKPOINTS = {
    base: { className: 'base', value: 0 },
    sm: { className: 'sm', value: 640 },
    md: { className: 'md', value: 768 },
    lg: { className: 'lg', value: 1024 },
    xl: { className: 'xl', value: 1280 },
    xxl: { className: 'xxl', value: 1536 }
} as const;

export const BREAKPOINT_ORDER = [
    BREAKPOINTS.base.className,
    BREAKPOINTS.sm.className,
    BREAKPOINTS.md.className,
    BREAKPOINTS.lg.className,
    BREAKPOINTS.xl.className,
    BREAKPOINTS.xxl.className
] as const;
