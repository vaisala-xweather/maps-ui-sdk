/* eslint-disable max-len */

import { DIRECTION_MAPPING } from './direction';

export const DIRECTION_REGEX = new RegExp(`\\b(${Object.keys(DIRECTION_MAPPING).join('|')})\\b`, 'g');
export const FIRST_LETTER_OF_WORDS_REGEX = /\b(\w)/g;
export const COORDINATE_REGEX = /^\s*\(?\s*([+-]?(?:90(?:\.0+)?|[1-8]?\d(?:\.\d+)?))\s*[\s,]\s*([+-]?(?:180(?:\.0+)?|(?:1[0-7]\d|[1-9]?\d)(?:\.\d+)?))\s*\)?\s*$/;
export const ZIPCODE_REGEX = /^(\d{5}(?:-\d{4})?|[a-ceghj-npr-tvxy]\d[a-z] ?\d[a-z]\d)$/i;
export const AIRPORT_CODE_REGEX = /^([a-z]{3}|[a-z]{4})$/i;
export const BRACKETS_TRIM_REGEX = /^[([]\s*|\s*[)\]]$/g;
