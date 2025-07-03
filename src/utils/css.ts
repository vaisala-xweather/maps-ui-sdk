import { CSSUnit } from '@/constants/css';

export const isValidCSSUnit = (unit: string): unit is CSSUnit => Object.values(CSSUnit).includes(unit as CSSUnit);

export const pixels = (value: number | string) => `${value}px`;
