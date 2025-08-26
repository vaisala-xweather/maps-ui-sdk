import {
    createContext,
    useContext,
    forwardRef,
    type ReactNode,
    type ForwardRefExoticComponent,
    type RefAttributes,
    type HTMLAttributes
} from 'react';
import clsx from 'clsx';
import { Button, type ButtonProps } from '@/components/primitives/buttons/Button';
import { Slot } from '@/components/primitives/utils/Slot';
import {
    ColorScalePreview,
    type ColorScalePreviewProps
} from '@/components/primitives/display/ColorScalePreview';

interface ThumbnailButtonContextProps {
  /** Used by <ThumbnailButton.Label /> and as a fallback aria-label when needed. */
  label?: string;
  /** Fallback colorscale key for Preview (prop `colorScaleKey` ?? root `id`). */
  defaultColorScaleKey?: string;
}

const ThumbnailButtonContext = createContext<ThumbnailButtonContextProps | null>(null);

const useThumbnailButtonContext = (): ThumbnailButtonContextProps => {
    const context = useContext(ThumbnailButtonContext);
    if (!context) {
        throw new Error('ThumbnailButton components must be used within ThumbnailButton.Root');
    }
    return context;
};

/**
 * `ThumbnailButton.Root`
 *
 * Button with a preview (default: ColorScalePreview) and an optional label.
 * If you render no visible text, set `aria-label` on the root.
 */

interface ThumbnailButtonRootProps extends ButtonProps {
  /** Text used by `<ThumbnailButton.Label />` and as a fallback `aria-label`. */
  label?: string;
  /** Colorscale key used by the default preview (falls back to `id`). */
  colorScaleKey?: ColorScalePreviewProps['colorScaleKey'];
  /** Custom composition; use `<ThumbnailButton.Preview asChild>` to slot a custom preview. */
  children?: ReactNode;
  /** If true, renders the child component with inherited props instead of the default element. */
  asChild?: boolean;
  /** Fallback CSS color when no colorScaleKey is passed and no `<ThumbnailButton.Preview />` override is used. */
  value?: string;
}

const ThumbnailButtonRoot = forwardRef<HTMLButtonElement, ThumbnailButtonRootProps>(({
    id,
    value,
    label,
    colorScaleKey,
    className,
    asChild,
    children,
    ...rest
}, ref) => {
    const ariaLabel = (rest as HTMLAttributes<HTMLButtonElement>)['aria-label'] ?? (children ? undefined : label);
    const resolvedScaleKey = colorScaleKey ?? (typeof id === 'string' ? id : undefined);

    const baseClassName = 'xw-thumbnail-button xw-flex xw-items-center';
    const defaultClassName = 'xw-gap-2';
    const effectiveClassName = clsx(baseClassName, className ?? defaultClassName);

    const Component = asChild ? Slot : Button;

    return (
        <Component
            ref={ref}
            id={id}
            value={value}
            aria-label={ariaLabel}
            data-preview
            className={effectiveClassName}
            {...rest}
        >
            <ThumbnailButtonContext.Provider
                value={{
                    label,
                    defaultColorScaleKey: resolvedScaleKey
                }}
            >
                {children ?? (
                    <>
                        <ThumbnailButtonPreview
                            colorScaleKey={resolvedScaleKey}
                            value={value}
                            className="xw-h-5 xw-w-10 xw-rounded xw-mr-2 xw-border-black xw-border"
                        />
                        <ThumbnailButtonLabel />
                    </>
                )}
            </ThumbnailButtonContext.Provider>
        </Component>
    );
});
ThumbnailButtonRoot.displayName = 'ThumbnailButton.Root';

/**
 * `ThumbnailButton.Preview`
 *
 * Default preview using `ColorScalePreview`. Use `asChild` to slot a custom element.
 * `colorScaleKey` falls back to the root `id` via context.
 */

interface ThumbnailButtonPreviewProps
  extends Omit<ColorScalePreviewProps, 'children' | 'id'> {
  asChild?: boolean;
  children?: ReactNode;
}

const ThumbnailButtonPreview = forwardRef<HTMLDivElement, ThumbnailButtonPreviewProps>((
    { asChild, className, colorScaleKey, value, children, ...rest },
    ref
) => {
    const { defaultColorScaleKey } = useThumbnailButtonContext();
    const Component = asChild ? Slot : ColorScalePreview;

    return (
        <Component
            ref={ref}
            colorScaleKey={colorScaleKey ?? defaultColorScaleKey}
            value={value}
            className={className}
            {...rest}
        >
            {children}
        </Component>
    );
});
ThumbnailButtonPreview.displayName = 'ThumbnailButton.Preview';

/**
 * `ThumbnailButton.Label`
 *
 * Plain text label for the tile. If omitted, ensure the root has an `aria-label`.
 */

interface ThumbnailButtonLabelProps {
  children?: ReactNode;
  className?: string;
}

const ThumbnailButtonLabel = ({ children, className }: ThumbnailButtonLabelProps) => {
    const { label } = useThumbnailButtonContext();
    return <span className={clsx(className)}>{children ?? label}</span>;
};
ThumbnailButtonLabel.displayName = 'ThumbnailButton.Label';

/**
 * `ThumbnailButton`
 *
 * Convenience wrapper that renders `ThumbnailButton.Root` and attaches subcomponents.
 */

type ThumbnailButtonProps = ThumbnailButtonRootProps;

type ThumbnailButtonComponent =
  ForwardRefExoticComponent<ThumbnailButtonProps & RefAttributes<HTMLButtonElement>> & {
    Root: typeof ThumbnailButtonRoot;
    Preview: typeof ThumbnailButtonPreview;
    Label: typeof ThumbnailButtonLabel;
  };

const ThumbnailButton = forwardRef<HTMLButtonElement, ThumbnailButtonProps>(
    ({ children, ...rest }, ref) => (
        <ThumbnailButtonRoot ref={ref} {...rest}>
            {children}
        </ThumbnailButtonRoot>
    )
) as ThumbnailButtonComponent;

ThumbnailButton.displayName = 'ThumbnailButton';

ThumbnailButton.Root = ThumbnailButtonRoot;
ThumbnailButton.Preview = ThumbnailButtonPreview;
ThumbnailButton.Label = ThumbnailButtonLabel;

/* ═══════════════════════════════════════════════════════════════════════════════════════════════ */

// Compound Component
export { ThumbnailButton, type ThumbnailButtonProps, type ThumbnailButtonComponent };

// Context
export { ThumbnailButtonContext, useThumbnailButtonContext, type ThumbnailButtonContextProps };

// Sub-components
export { ThumbnailButtonRoot, type ThumbnailButtonRootProps };
export { ThumbnailButtonPreview, type ThumbnailButtonPreviewProps };
export { ThumbnailButtonLabel, type ThumbnailButtonLabelProps };
