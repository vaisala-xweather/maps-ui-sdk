import { ColorRangeProvider, ColorRangeProviderProps } from '@/providers/ColorRangeProvider';
import { useDimensions } from '@/hooks/useDimensions';
import { ColorRangeOffset } from './ColorRangeOffset';
import { ColorRangeBar } from './ColorRangeBar';
import { ColorRangeGradient } from './ColorRangeGradient';
import { ColorRangeCircle } from './ColorRangeCircle';
import { ColorRangeLabel } from './ColorRangeLabel';

type ColorRangeRootProps = ColorRangeProviderProps;

const ColorRangeRoot = ({ children, ...rest }: ColorRangeRootProps) => {
    const { ref, dimensions } = useDimensions<HTMLDivElement>(undefined, true);

    return (
        <div ref={ref} className="xw-w-full">
            <ColorRangeProvider {...rest} containerWidth={dimensions?.width}>
                {children}
            </ColorRangeProvider>
        </div>
    );
};
ColorRangeRoot.displayName = 'ColorRange.Root';

type ColorRangeProps = ColorRangeRootProps;

const ColorRange = ({ children, ...rest }: ColorRangeProps) => (
    <ColorRange.Root {...rest}>{children}</ColorRange.Root>
);
ColorRange.displayName = 'ColorRange';

ColorRange.Root = ColorRangeRoot;
ColorRange.Offset = ColorRangeOffset;
ColorRange.Bar = ColorRangeBar;
ColorRange.Gradient = ColorRangeGradient;
ColorRange.Circle = ColorRangeCircle;
ColorRange.Label = ColorRangeLabel;

/* ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
// Compound Component
export { ColorRange, type ColorRangeProps };

// Context
export { ColorRangeProvider, type ColorRangeProviderProps } from '@/providers/ColorRangeProvider';

// Sub-components
export { ColorRangeRoot, type ColorRangeRootProps };
export { ColorRangeOffset, type ColorRangeOffsetProps } from './ColorRangeOffset';
export { ColorRangeBar, type ColorRangeBarProps } from './ColorRangeBar';
export { ColorRangeGradient, type ColorRangeGradientProps } from './ColorRangeGradient';
export { ColorRangeCircle, type ColorRangeCircleProps } from './ColorRangeCircle';
export { ColorRangeLabel, type ColorRangeLabelProps } from './ColorRangeLabel';
/* ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
