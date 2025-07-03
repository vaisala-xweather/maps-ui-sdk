import { Responsive } from '@/types/responsive';
import { resolveResponsiveProperty } from '@/utils/responsive';
import { AnchorValue } from '@/types/anchor';
import { ANCHOR } from '@/constants/anchor';
import { useAnchor, UseAnchorProps } from './useAnchor';
import { useResponsive } from './useResponsive';

export interface UseResponsiveAnchorProps extends Omit<UseAnchorProps, 'anchor'> {
    anchor?: Responsive<AnchorValue>;
}

export const useResponsiveAnchor = ({ anchor, ...offsets }: UseResponsiveAnchorProps) => {
    const { breakpoint } = useResponsive(0);
    const resolvedAnchor = resolveResponsiveProperty(anchor, breakpoint);
    const anchorStyle = useAnchor({
        anchor: resolvedAnchor ?? ANCHOR.topLeft,
        ...offsets
    });

    return { anchorStyle, resolvedAnchor };
};
