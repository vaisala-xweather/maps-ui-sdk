import {
    forwardRef,
    useMemo,
    type CSSProperties,
    type HTMLAttributes,
    type ReactNode
} from 'react';
import clsx from 'clsx';
import { Slot } from '@/components/primitives/utils/Slot';
import { useSettingsContext } from '@/providers/SettingsProvider';
import { previewStyleFromScale, isCssColor } from '@/utils/color';

export interface ColorScalePreviewProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Key used to look up a colorscale in SettingsProvider.colorScales. */
  colorScaleKey?: string;
  /** Fallback CSS color when no colorscale is found. */
  value?: string;
  /** If true, renders children with inherited props instead of the default element. */
  asChild?: boolean;
  /** Child used when `asChild` is true. */
  children?: ReactNode;
  /** Additional Tailwind classes; if omitted, defaults are applied. */
  className?: string;
  /** Inline styles merged after computed preview styles. */
  style?: CSSProperties;
}

/** Small preview of a color scale (gradient) or a solid color. */
export const ColorScalePreview = forwardRef<HTMLDivElement, ColorScalePreviewProps>((
    {
        colorScaleKey,
        value,
        asChild = false,
        className,
        children,
        style,
        ...rest
    },
    ref
) => {
    const { colorScales } = useSettingsContext();

    const computedStyle = useMemo(() => {
        const colorScale = colorScaleKey && colorScales ? colorScales[colorScaleKey] : undefined;
        if (colorScale) {
            const gradientStyle = previewStyleFromScale(colorScale);
            if (gradientStyle && Object.keys(gradientStyle).length > 0) {
                return { ...gradientStyle, ...style };
            }
        }
        if (isCssColor(value)) return { backgroundColor: value, ...style };
        return style;
    }, [colorScaleKey, colorScales, value, style]);

    const ariaProps = (rest['aria-label'] || rest['aria-labelledby'])
        ? { role: 'img' as const }
        : { 'aria-hidden': true as const };

    const baseClassName = 'xw-color-scale-preview';
    const defaultClassName = 'xw-h-5 xw-w-10 xw-rounded xw-border xw-border-black xw-overflow-hidden';
    const effectiveClassName = clsx(baseClassName, className ?? defaultClassName);

    const props = {
        ref,
        style: computedStyle,
        className: effectiveClassName,
        ...ariaProps,
        ...rest
    };

    const Component = asChild ? Slot : 'div';

    return (
        <Component {...props}>
            {children}
        </Component>
    );
});

ColorScalePreview.displayName = 'ColorScalePreview';
