import { KeyboardEvent, useCallback } from 'react';
import { SearchResult } from '@/types/search';
import { KEYS } from '@/constants/keyboard';

export interface UseComboBoxKeyboardProps {
    items: SearchResult[];
    activeDescendantId: string | null;
    setActiveDescendantId: (id: string | null) => void;
    onSelectResult: (item: SearchResult) => void;
}

export const useComboBoxKeyboard = ({
    items,
    activeDescendantId,
    setActiveDescendantId,
    onSelectResult
}: UseComboBoxKeyboardProps) => {
    const handleKeyDown = useCallback(
        (e: KeyboardEvent<HTMLInputElement>) => {
            const currentIndex = activeDescendantId
                ? items.findIndex((r) => r.trackingId === activeDescendantId)
                : -1;

            switch (e.key) {
                case KEYS.arrowDown: {
                    e.preventDefault();

                    if (items.length === 0) return;

                    const isAtLastItem = currentIndex === items.length - 1;
                    const nextId = isAtLastItem
                        ? items[0].trackingId
                        : items[currentIndex + 1]?.trackingId;

                    setActiveDescendantId(nextId ?? null);
                    break;
                }
                case KEYS.arrowUp: {
                    e.preventDefault();

                    if (items.length === 0) return;

                    const isAtFirstItem = currentIndex <= 0;
                    const prevId = isAtFirstItem
                        ? items.at(-1)?.trackingId
                        : items[currentIndex - 1]?.trackingId;

                    setActiveDescendantId(prevId ?? null);
                    break;
                }
                case KEYS.enter: {
                    e.preventDefault();

                    if (currentIndex >= 0) {
                        onSelectResult(items[currentIndex]);
                    } else if (items.length > 0) {
                        onSelectResult(items[0]);
                    }
                    break;
                }
                case KEYS.escape: {
                    e.preventDefault();

                    if (activeDescendantId) {
                        setActiveDescendantId(null);
                    }
                    break;
                }
                default: {
                    break;
                }
            }
        },
        [items, activeDescendantId, setActiveDescendantId, onSelectResult]
    );

    return { handleKeyDown };
};
