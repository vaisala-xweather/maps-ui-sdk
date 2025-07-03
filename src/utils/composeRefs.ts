/* eslint-disable unicorn/prevent-abbreviations */
import { type Ref } from 'react';

/**
 * Utility to compose multiple refs into one
 * Adapted from Radix UI's composeRefs implementation
 * (https://github.com/radix-ui/primitives/blob/main/packages/react/compose-refs/src/composeRefs.tsx)
 *
 * @param refs - Array of refs to compose
 * @returns A function that takes a node and assigns it to each ref
 */
export const composeRefs = <T>(...refs: (Ref<T> | undefined)[]) => (node: T | null) => {
    refs.forEach((ref) => {
        if (typeof ref === 'function') {
            ref(node);
        } else if (ref != null) {
            (ref as { current: T | null }).current = node;
        }
    });
};
