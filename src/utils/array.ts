export const sortByAscending = (array: number[]) => array.sort((a, b) => a - b);

/**
 * Splits an array into two arrays based on a predicate
 * @example
 * const numbers = [1, 2, 3, 4, 5];
 * partitionArray(numbers, n => n % 2 === 0) // [[2, 4], [1, 3, 5]]
 */
export const partitionArray = <T>(
    array: T[],
    predicate: (item: T) => boolean
): [T[], T[]] => array.reduce<[T[], T[]]>(
    ([pass, fail], elem) => (predicate(elem)
        ? [[...pass, elem], fail]
        : [pass, [...fail, elem]]),
    [[], []]
);

export const removeItem = <T>(array: T[], item: T) => array.filter((i) => i !== item);

/**
 * Extracts a specified property from each item in an array
 * @example
 * const users = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }];
 * extractProperty(users, 'id') // [1, 2]
 */
export const extractProperty = <T, K extends keyof T>(array: T[], key: K): T[K][] => array.map((item) => item[key]);
