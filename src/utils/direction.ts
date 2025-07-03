import { DIRECTION_MAPPING } from '@/constants/direction';
import { DIRECTION_REGEX } from '@/constants/regex';

export const toDirectionLong = (direction: string): string => DIRECTION_MAPPING[direction.toUpperCase()] || direction;

export const formatDirections = (text: string): string => text
    .replace(DIRECTION_REGEX, (match) => toDirectionLong(match));
