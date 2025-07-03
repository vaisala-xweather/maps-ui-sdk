import { SIDE, ALIGN, POSITION } from '@/constants/position';

export type Side = typeof SIDE[keyof typeof SIDE];
export type Align = typeof ALIGN[keyof typeof ALIGN];
export type Position = typeof POSITION[keyof typeof POSITION];
