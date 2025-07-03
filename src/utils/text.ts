import {
    FIRST_LETTER_OF_WORDS_REGEX
} from '@/constants/regex';

export const capitalizeWords = (value: string): string => {
    if (typeof value !== 'string') {
        return '';
    }

    return value
        .toLowerCase()
        .replace(FIRST_LETTER_OF_WORDS_REGEX, (match) => match.toUpperCase());
};

export const sanitizeText = (value: string): string => value?.trim().replaceAll(/,\s+/g, ',').replace(/,$/, '');
