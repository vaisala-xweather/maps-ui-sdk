export const DATE_TIME_FORMATS = {
    // Date
    dateNumeric: 'M/d', // 10/8
    dateLong: 'EEEE, MMMM d', // Friday, October 8
    dateShort: 'EEE, MMM d', // Fri, Oct 8

    // Month
    monthLong: 'MMMM', // October
    monthShort: 'MMM', // Oct
    monthNumeric: 'M', // 10

    // Day
    dayLong: 'EEEE', // Friday
    dayShort: 'EEE', // Fri

    // Time
    time24: 'HH:mm', // 15:30
    time12: 'h:mm a' // 3:30 PM
} as const;
