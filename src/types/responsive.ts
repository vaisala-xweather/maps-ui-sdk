import { BREAKPOINTS } from '@/constants/responsive';

export type Breakpoint = (typeof BREAKPOINTS)[keyof typeof BREAKPOINTS]['className'];
export type ResponsiveObject<T> = Partial<Record<Breakpoint, T>>;
export type Responsive<T> = T | ResponsiveObject<T>;
