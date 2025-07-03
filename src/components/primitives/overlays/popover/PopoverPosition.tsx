import { PositionProvider, PositionProviderProps } from '@/providers/PositionProvider';
import { SIDE, ALIGN, POSITION } from '@/constants/position';

export type PopoverPositionProps = PositionProviderProps;

export const PopoverPosition = ({
    children,
    side = SIDE.top,
    align = ALIGN.center,
    position = POSITION.fixed,
    ...rest
}: PopoverPositionProps) => (
    <PositionProvider
        {...rest}
        side={side}
        position={position}
        align={align}
    >
        {children}
    </PositionProvider>
);
