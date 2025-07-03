import { Side, Align } from '@/types/position';
import { Responsive } from '@/types/responsive';
import { resolveResponsiveProperty } from '@/utils/responsive';
import { usePosition, UsePositionProps } from './usePosition';
import { useResponsive } from './useResponsive';

export interface UseResponsivePositionProps extends Omit<UsePositionProps, 'side' | 'align'> {
    side?: Responsive<Side>;
    align?: Responsive<Align>;
    delayInMilliseconds?: number;
}

export const useResponsivePosition = (props: UseResponsivePositionProps) => {
    const { side, align, delayInMilliseconds = 15 } = props;
    const { breakpoint } = useResponsive(delayInMilliseconds);
    const resolvedSide = resolveResponsiveProperty(side, breakpoint);
    const resolvedAlign = resolveResponsiveProperty(align, breakpoint);
    const position = usePosition({
        ...props,
        side: resolvedSide,
        align: resolvedAlign
    });

    return {
        ...position,
        resolvedSide,
        resolvedAlign
    };
};
