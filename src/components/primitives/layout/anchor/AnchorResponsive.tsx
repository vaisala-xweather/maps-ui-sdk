import { useResponsiveAnchor } from '@/hooks/useResponsiveAnchor';
import { Responsive } from '@/types/responsive';
import { AnchorValue } from '@/types/anchor';
import { ANCHOR } from '@/constants/anchor';
import { AnchorBase, AnchorBaseProps } from './AnchorBase';

export interface AnchorResponsiveProps extends Omit<AnchorBaseProps, 'anchor'> {
    anchor?: Responsive<AnchorValue>;
}

export const AnchorResponsive = ({
    children,
    className,
    anchor = { base: ANCHOR.topLeft },
    style,
    ...offsets
}: AnchorResponsiveProps) => {
    const { anchorStyle, resolvedAnchor } = useResponsiveAnchor({ anchor, ...offsets });

    if (resolvedAnchor === undefined) {
        console.warn('AnchorResponsive: Failed to resolve anchor value');
        return null;
    }

    return (
        <AnchorBase
            children={children}
            className={className}
            anchor={resolvedAnchor}
            style={{ ...anchorStyle, ...style }}
            {...offsets}
        />
    );
};
