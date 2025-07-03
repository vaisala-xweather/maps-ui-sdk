import { AnchorProvider } from '@/providers/AnchorProvider';
import { ANCHOR } from '@/constants/anchor';
import { AnchorResponsive } from './AnchorResponsive';
import { AnchorPosition } from './AnchorPosition';
import { AnchorBase, AnchorBaseProps } from './AnchorBase';

export const Anchor = {
    Position: AnchorPosition,
    Responsive: AnchorResponsive,
    Provider: AnchorProvider,
    TopLeft: (props: AnchorBaseProps) => <AnchorBase {...props} anchor={ANCHOR.topLeft} />,
    Top: (props: AnchorBaseProps) => <AnchorBase {...props} anchor={ANCHOR.top} />,
    TopRight: (props: AnchorBaseProps) => <AnchorBase {...props} anchor={ANCHOR.topRight} />,
    Right: (props: AnchorBaseProps) => <AnchorBase {...props} anchor={ANCHOR.right} />,
    BottomRight: (props: AnchorBaseProps) => <AnchorBase {...props} anchor={ANCHOR.bottomRight} />,
    Bottom: (props: AnchorBaseProps) => <AnchorBase {...props} anchor={ANCHOR.bottom} />,
    BottomLeft: (props: AnchorBaseProps) => <AnchorBase {...props} anchor={ANCHOR.bottomLeft} />,
    Left: (props: AnchorBaseProps) => <AnchorBase {...props} anchor={ANCHOR.left} />,
    Center: (props: AnchorBaseProps) => <AnchorBase {...props} anchor={ANCHOR.center} />,
    CenterTop: (props: AnchorBaseProps) => <AnchorBase {...props} anchor={ANCHOR.centerTop} />,
    CenterRight: (props: AnchorBaseProps) => <AnchorBase {...props} anchor={ANCHOR.centerRight} />,
    CenterLeft: (props: AnchorBaseProps) => <AnchorBase {...props} anchor={ANCHOR.centerLeft} />,
    CenterBottom: (props: AnchorBaseProps) => <AnchorBase {...props} anchor={ANCHOR.centerBottom} />
};

export { type AnchorBaseProps, AnchorBase } from './AnchorBase';
export { type AnchorPositionProps, AnchorPosition } from './AnchorPosition';
export { type AnchorResponsiveProps, AnchorResponsive } from './AnchorResponsive';
