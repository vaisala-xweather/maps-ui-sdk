import {
    CSSProperties,
    createContext,
    useContext,
    ReactNode,
    RefObject,
    useState,
    useCallback
} from 'react';
import { useResponsivePosition } from '@/hooks/useResponsivePosition';
import { useDimensions } from '@/hooks/useDimensions';
import { Side, Align } from '@/types/position';
import { Responsive } from '@/types/responsive';
import { DEFAULT_COLLISION_PADDING } from '@/constants/position';

export interface PositionContextProps {
  offsetX: number;
  offsetY: number;
  collisionPadding: number;
  position: CSSProperties['position'];
  triggerRef: RefObject<HTMLElement>;
  contentElement: HTMLElement | null;
  side?: Side;
  align?: Align;
  top: number | undefined;
  left: number | undefined;
  responsivePositioningDelay?: number;
  setContentElement: (node: HTMLDivElement | null) => void;
}

export const PositionContext = createContext<PositionContextProps | null>(null);

export const usePositionContext = () => {
    const context = useContext(PositionContext);
    if (!context) {
        const defaultRef = { current: null };
        return {
            side: undefined,
            align: undefined,
            offsetX: 0,
            offsetY: 0,
            position: undefined,
            triggerRef: defaultRef,
            contentElement: null,
            collisionPadding: DEFAULT_COLLISION_PADDING,
            top: 0,
            left: 0
        } as PositionContextProps;
    }
    return context;
};

export interface PositionProviderProps {
    children: ReactNode;
    side?: Responsive<Side>;
    align?: Responsive<Align>;
    offset?: number;
    offsetX?: number;
    offsetY?: number;
    position?: CSSProperties['position'];
    relativeToRef?: RefObject<HTMLElement>;
    collisionPadding?: number;
    responsivePositioningDelay?: number;
}

export const PositionProvider = ({
    children,
    side,
    align,
    offset,
    offsetX,
    offsetY,
    position,
    relativeToRef,
    collisionPadding,
    responsivePositioningDelay
}: PositionProviderProps) => {
    const {
        ref: triggerRef,
        dimensions: triggerDimensions
    } = useDimensions(relativeToRef?.current ?? undefined, true);
    const positionContext = usePositionContext();
    const [contentElement, setContentElement] = useState<HTMLElement | null>(null);
    const setContentElementCallback = useCallback((node: HTMLElement | null) => {
        setContentElement(node);
    }, []);

    const effectiveCollisionPadding = collisionPadding === undefined
        ? positionContext?.collisionPadding ?? DEFAULT_COLLISION_PADDING
        : collisionPadding;

    const effectiveOffsetX = offsetX ?? offset ?? 0;
    const effectiveOffsetY = offsetY ?? offset ?? 0;

    const { top, left, resolvedAlign, resolvedSide } = useResponsivePosition({
        side,
        align,
        offsetX: effectiveOffsetX,
        offsetY: effectiveOffsetY,
        collisionPadding: effectiveCollisionPadding,
        triggerDimensions,
        contentElement,
        delayInMilliseconds: responsivePositioningDelay
    });

    return (
        <PositionContext.Provider
            value={{
                offsetX: effectiveOffsetX,
                offsetY: effectiveOffsetY,
                collisionPadding: effectiveCollisionPadding,
                position,
                triggerRef,
                contentElement,
                side: resolvedSide,
                align: resolvedAlign,
                top,
                left,
                setContentElement: setContentElementCallback
            }}
        >
            {children}
        </PositionContext.Provider>
    );
};
