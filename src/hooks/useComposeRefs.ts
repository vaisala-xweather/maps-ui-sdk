/* eslint-disable unicorn/prevent-abbreviations */

import { useCallback, type Ref } from 'react';
import { composeRefs } from '@/utils/composeRefs';

/**
 * Hook version of composeRefs that memoizes the ref callback
 * Adapted from Radix UI's useComposedRefs implementation
 * (https://github.com/radix-ui/primitives/blob/main/packages/react/compose-refs/src/composeRefs.tsx)
 *
 * @param refs - Array of refs to compose
 * @returns A memoized callback ref that updates all provided refs
 */
export function useComposedRefs<T>(...refs: (Ref<T> | undefined)[]) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useCallback(composeRefs(...refs), refs);
}
