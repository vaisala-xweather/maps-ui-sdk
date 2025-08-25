import { deepmergeCustom } from 'deepmerge-ts';

export const deepMerge = deepmergeCustom({
    mergeArrays: false
});
