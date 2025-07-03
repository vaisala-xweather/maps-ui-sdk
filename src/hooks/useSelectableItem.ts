import { useRef, useCallback, useEffect } from 'react';
import { KeyboardNavItem } from '@/hooks/useKeyboardNavigation';

export interface UseSelectableItemProps<T> {
    /**
     * The item's associated value.
     */
    value: T;

    /**
     * If true, the item is disabled and cannot be selected or focused.
     */
    disabled?: boolean;

    /**
     * Whether this item is currently selected.
     */
    isSelected: boolean;

    /**
     * Callback triggered when the user's action should change selection.
     * The parent controls how selection changes (e.g., replacing the current value for radio,
     * toggling values for multi-select), but `useSelectableItem` can trigger this callback on user interaction.
     */
    onValueChange: (value: T) => void;

    /**
     * Registers the item with the parent collection for keyboard navigation (Passed from useSelectableCollection).
     */
    registerItem: (item: KeyboardNavItem<T>) => void;
}

/**
 * `useSelectableItem`
 *
 * A generic hook for any selectable item in a collection:
 * - Registers the item for keyboard navigation.
 * - On user click (if not disabled), calls `onValueChange` to select this item.
 * - Automatically focuses the item when it is clicked or transitions from unselected to selected,
 *   ensuring a consistent user experience.
 *
 * The parent component decides how `isSelected` and `onValueChange` work.
 * This hook just uses those to handle focus and user-triggered selection changes.
 */
export function useSelectableItem<T>({
    value,
    disabled,
    isSelected,
    onValueChange,
    registerItem
}: UseSelectableItemProps<T>) {
    const elementRef = useRef<HTMLButtonElement | null>(null);
    const wasSelectedRef = useRef(isSelected);

    const refCallback = useCallback((node: HTMLButtonElement | null) => {
        elementRef.current = node;
        if (node) {
            registerItem({ value, disabled: !!disabled, element: node });
        }
    }, [value, disabled, registerItem]);

    const handleClick = useCallback(() => {
        if (!disabled) {
            onValueChange(value);
        }
    }, [disabled, onValueChange, value]);

    useEffect(() => {
        // Focus the item when it transitions from unselected to selected
        if (!wasSelectedRef.current && isSelected && elementRef.current) {
            elementRef.current.focus();
        }
        wasSelectedRef.current = isSelected;
    }, [isSelected]);

    return { refCallback, handleClick };
}
