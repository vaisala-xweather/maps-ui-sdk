import { useRef, useCallback } from 'react';
import { useKeyboardNavigation, KeyboardNavItem, UseKeyboardNavigationOptions } from '@/hooks/useKeyboardNavigation';

export type UseSelectableCollectionOptions<T, M extends boolean = false> = (
    Omit<UseKeyboardNavigationOptions<T, M>, 'items'>
);

/**
 * `useSelectableCollection`
 *
 * Manages a collection of selectable items for keyboard navigation:
 * - Maintains an array of items with `registerItem`.
 * - Uses `useKeyboardNavigation` to handle arrow keys, home/end, and selection via keyboard.
 *
 * Does not assume any specific selection logic.
 * That is controlled by `role`, `value`, `onValueChange`, and `multiSelect` passed to `useKeyboardNavigation`.
 */
export function useSelectableCollection<T, M extends boolean = false>({
    value,
    onValueChange,
    multiSelect = false as M,
    ...options
}: UseSelectableCollectionOptions<T, M>) {
    const itemsRef = useRef<KeyboardNavItem<T>[]>([]);

    const registerItem = useCallback((item: KeyboardNavItem<T>) => {
        const existingIndex = itemsRef.current.findIndex((it) => it.value === item.value);
        if (existingIndex >= 0) {
            itemsRef.current[existingIndex] = item;
        } else {
            itemsRef.current.push(item);
        }
    }, []);

    const { onKeyDown } = useKeyboardNavigation<T, M>({
        ...options,
        items: itemsRef.current,
        value: value as M extends true ? T[] : T | null,
        onValueChange: onValueChange as M extends true ? (values: T[]) => void : (value: T | null) => void,
        multiSelect
    });

    return { onKeyDown, registerItem };
}
