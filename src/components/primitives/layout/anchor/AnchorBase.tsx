import { ReactNode, CSSProperties } from 'react';
import { useAnchor } from '@/hooks/useAnchor';
import { AnchorProvider } from '@/providers/AnchorProvider';
import { ANCHOR } from '@/constants/anchor';
import { AnchorValue } from '@/types/anchor';

export interface AnchorBaseProps {
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
    anchor?: AnchorValue;
    offset?: number;
    offsetX?: number;
    offsetY?: number;
}

export const AnchorBase = ({
    children,
    className,
    style,
    anchor = ANCHOR.topLeft,
    ...offsets
}: AnchorBaseProps) => {
    const anchorStyle = useAnchor({ anchor, ...offsets });
    return (
        <AnchorProvider anchor={anchor}>
            <div
                className={className}
                style={{
                    ...anchorStyle,
                    ...style
                }}
            >
                {children}
            </div>
        </AnchorProvider>
    );
};
