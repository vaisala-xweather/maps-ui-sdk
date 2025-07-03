import { KeyboardEvent, useCallback } from 'react';
import { KEYS } from '@/constants/keyboard';
/**
 * The role of the interactive elements controlled by `useKeyboardNavigation`.
 * Common ARIA roles are supported.
 */
export type KeyNavigationRole = 'button' | 'radio' | 'tab' | 'menuitem' | 'option';

// Define separate types for single and multiSelect modes
type SingleOnValueChange<T> = (value: (T | null) | T) => void;
type MultiOnValueChange<T> = (values: T[]) => void;

/**
 * Represents a single interactive item managed by `useKeyboardNavigation`.
 * Each item provides its `value` and a reference to its `element`.
 * `disabled` indicates if the item is not currently interactive.
 */
export interface KeyboardNavItem<T> {
    /** The item's associated value. Used to determine selection. */
    value: T;
    /** If true, this item is not focusable or selectable. */
    disabled?: boolean;
    /** The DOM element associated with this item. */
    element: HTMLElement | null;
}

/**
 * Configuration for `useKeyboardNavigation`.
 *
 */
export interface UseKeyboardNavigationOptions<T, M extends boolean = false> {
    /**
     * The ARIA role describing the interactive elements.
     * Determines default behavior like `requireSelection` for `radio` or `tab`.
     */
    role: KeyNavigationRole;
    /**
     * The currently selected value(s).
     * - For single selection, a `T` or `null`.
     * - For multiSelect selection, a `T[]`.
     */
    value: M extends true ? T[] : T | null;
    /**
     * Called when the selection changes due to keyboard interaction.
     * In single selection mode: `(newValue: T | null) => void`
     * In multiSelect selection mode: `(newValues: T[]) => void`
     */
    onValueChange: M extends true ? MultiOnValueChange<T> : SingleOnValueChange<T>;
    /**
     * The list of items, each with a value and a ref to its element.
     * This replaces DOM queries and ensures stable navigation.
     */
    items: KeyboardNavItem<T>[];
    /**
     * If true, ensures one item is always selected.
     * Defaults to true for `radio` and `tab` roles, otherwise false.
     */
    requireSelection?: boolean;
    /**
     * If true, multiSelect items can be selected simultaneously.
     */
    multiSelect?: boolean;
}

/**
 * Provides accessible keyboard navigation for a group of interactive elements.
 *
 * Key Features:
 * - Arrow keys move focus among items.
 * - Home/End keys jump to the first/last enabled item.
 * - Enter/Space select or toggle items.
 * - Supports single or multiSelect selection modes.
 * - For `radio` or `tab` roles, `requireSelection` defaults to `true`.
 *
 * @remarks
 * To use this hook effectively:
 * - Ensure the `items` array is stable and contains `{ value, element, disabled }`.
 * - Attach the returned `onKeyDown` handler to the container element.
 * - Apply `tabIndex` values (`0` for active items, `-1` for others).
 * - Call `onValueChange` to update your selection state.
 *
 * By managing `items` and focus at the root, you avoid fragile DOM queries.
 *
 */
export function useKeyboardNavigation<T, M extends boolean = false>({
    role,
    value,
    onValueChange,
    items,
    requireSelection = role === 'radio' || role === 'tab',
    multiSelect = false
}: UseKeyboardNavigationOptions<T, M>) {
    const focusItem = useCallback((index: number) => {
        const item = items[index];
        if (item?.element) {
            item.element.focus();
        }
    }, [items]);

    const selectItem = useCallback((itemValue: T) => {
        if (multiSelect) {
            const currentValues = value as T[];
            const isSelected = currentValues.includes(itemValue);
            const newValues = isSelected
                ? currentValues.filter((v) => v !== itemValue)
                : [...currentValues, itemValue];
            (onValueChange as MultiOnValueChange<T>)(newValues);
        } else {
            const singleVal = value as T | null;
            const newVal = singleVal === itemValue && !requireSelection ? null : itemValue;
            (onValueChange as SingleOnValueChange<T>)(newVal);
        }
    }, [multiSelect, onValueChange, requireSelection, value]);

    const moveFocus = useCallback((currentIndex: number, direction: 1 | -1) => {
        if (items.length === 0) return;
        let nextIndex = currentIndex;
        do {
            nextIndex = (nextIndex + direction + items.length) % items.length;
        } while (items[nextIndex]?.disabled && nextIndex !== currentIndex);

        focusItem(nextIndex);

        // For `radio` or `tab`, moving via arrow keys also selects
        if (!multiSelect && (role === 'radio' || role === 'tab')) {
            const nextItem = items[nextIndex];
            if (nextItem && !nextItem.disabled) {
                selectItem(nextItem.value);
            }
        }
    }, [items, focusItem, multiSelect, role, selectItem]);

    const handleHome = useCallback(() => {
        const firstIndex = items.findIndex((item) => !item.disabled);
        if (firstIndex >= 0) {
            focusItem(firstIndex);
            if (!multiSelect && requireSelection) {
                selectItem(items[firstIndex].value);
            }
        }
    }, [focusItem, items, multiSelect, requireSelection, selectItem]);

    const handleEnd = useCallback(() => {
        for (let i = items.length - 1; i >= 0; i--) {
            if (!items[i].disabled) {
                focusItem(i);
                if (!multiSelect && requireSelection) {
                    selectItem(items[i].value);
                }
                break;
            }
        }
    }, [focusItem, items, multiSelect, requireSelection, selectItem]);

    const onKeyDown = useCallback((event: KeyboardEvent) => {
        const { key, target } = event;
        if (!(target instanceof HTMLElement)) return;

        const currentIndex = items.findIndex((it) => it.element === target);
        if (currentIndex < 0) return;

        const ARROW_KEYS = [KEYS.arrowRight, KEYS.arrowLeft, KEYS.arrowUp, KEYS.arrowDown] as string[];
        const HOME_END_KEYS = [KEYS.home, KEYS.end] as string[];
        const SELECT_KEYS = [KEYS.enter, KEYS.space] as string[];

        const isArrow = ARROW_KEYS.includes(key);
        const isHomeEnd = HOME_END_KEYS.includes(key);
        const isSelectKey = SELECT_KEYS.includes(key);

        if (isArrow || isHomeEnd || isSelectKey) {
            event.preventDefault();
        }

        if (key === KEYS.arrowRight || key === KEYS.arrowDown) {
            moveFocus(currentIndex, 1);
        } else if (key === KEYS.arrowLeft || key === KEYS.arrowUp) {
            moveFocus(currentIndex, -1);
        } else if (key === KEYS.home) {
            handleHome();
        } else if (key === KEYS.end) {
            handleEnd();
        } else if (key === KEYS.enter || key === KEYS.space) {
            const currentItem = items[currentIndex];
            if (currentItem && !currentItem.disabled) {
                selectItem(currentItem.value);
            }
        }
    }, [items, selectItem, moveFocus, handleHome, handleEnd]);

    return { onKeyDown };
}
