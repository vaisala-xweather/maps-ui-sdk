import { usePositionContext } from '@/providers/PositionProvider';
import { getAnchorStyle } from '@/utils/anchor';
import { AnchorValue } from '@/types/anchor';
import { ANCHOR } from '@/constants/anchor';

export interface UseAnchorProps {
    anchor?: AnchorValue;
    offset?: number;
    offsetX?: number;
    offsetY?: number;
}

export const useAnchor = ({
    anchor = ANCHOR.topLeft,
    offset,
    offsetX,
    offsetY
}: UseAnchorProps) => {
    const { offsetX: contextOffsetX, offsetY: contextOffsetY } = usePositionContext();

    const effectiveOffsetX = offsetX ?? offset ?? contextOffsetX ?? 0;
    const effectiveOffsetY = offsetY ?? offset ?? contextOffsetY ?? 0;

    return getAnchorStyle(anchor, effectiveOffsetX, effectiveOffsetY);
};
