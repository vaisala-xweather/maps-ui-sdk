import {
    forwardRef,
    isValidElement,
    cloneElement,
    type ReactElement,
    type ReactNode,
    type Ref,
    type ForwardRefExoticComponent,
    type RefAttributes
} from 'react';
import { composeRefs } from '@/utils/composeRefs';

/** Represents any valid props object */
type AnyProps = Record<string, unknown>;

/** Pattern to detect React event handler props */
const EVENT_HANDLER_PATTERN = /^on[A-Z]/;

/**
 * Merges props from a slot component with props from its child,
 * prioritizing child props over slot props
 */
const mergeProps = (slotProps: AnyProps, childProps: AnyProps): AnyProps => {
    // Start with slot props as base
    const merged = { ...slotProps };

    // Merge in child props, handling special cases
    Object.keys(childProps).forEach((propName) => {
        const slotPropValue = slotProps[propName];
        const childPropValue = childProps[propName];

        if (EVENT_HANDLER_PATTERN.test(propName)) {
            merged[propName] = typeof slotPropValue === 'function' && typeof childPropValue === 'function'
                ? (...args: unknown[]) => {
                    childPropValue(...args);
                    slotPropValue(...args);
                }
                : childPropValue;
        } else if (propName === 'style') {
            merged[propName] = {
                ...slotPropValue as Record<string, unknown>,
                ...childPropValue as Record<string, unknown>
            };
        } else if (propName === 'className') {
            merged[propName] = [slotPropValue, childPropValue]
                .filter(Boolean)
                .join(' ');
        } else {
            merged[propName] = childPropValue;
        }
    });

    return merged;
};

/**
 * Gets the ref from a React element, handling different React versions
 */
// Before React 19 accessing `element.props.ref` will throw a warning and suggest using `element.ref`
// After React 19 accessing `element.ref` does the opposite.
// https://github.com/facebook/react/pull/28348
//
// Access the ref using the method that doesn't yield a warning.
const getElementRef = (element: ReactElement) => {
    // React <=18 in DEV
    let getter = Object.getOwnPropertyDescriptor(element.props, 'ref')?.get;
    let mayWarn = getter && 'isReactWarning' in getter && getter.isReactWarning;
    if (mayWarn) {
        return (element as any).ref;
    }

    // React 19 in DEV
    getter = Object.getOwnPropertyDescriptor(element, 'ref')?.get;
    mayWarn = getter && 'isReactWarning' in getter && getter.isReactWarning;
    if (mayWarn) {
        return (element.props as { ref?: Ref<unknown> }).ref;
    }

    // Not DEV
    return (element.props as { ref?: Ref<unknown> }).ref || (element as any).ref;
};

interface SlotProps extends AnyProps {
    /** The child element to receive the merged props */
    children: ReactNode;
}

/**
 * A component that merges props with its child while maintaining the child's type.
 * Adapted from Radix UI's Slot implementation
 * (https://github.com/radix-ui/primitives/blob/main/packages/react/slot/src/Slot.tsx)
 *
 * @remarks
 * The ref handling is particularly important here because:
 * 1. We need to maintain any existing ref on the child component
 * 2. We need to support refs passed to the Slot itself
 * 3. When both exist, we need to compose them so both refs point to the same element
 *
 * This is crucial for components that rely on refs for functionality
 * or when using refs for imperative handles.
 *
 * @example
 * ```tsx
 * <Slot className="added-class" onClick={handleClick}>
 *   <Button className="original-class">Click me</Button>
 * </Slot>
 * ```
 */
export const Slot: ForwardRefExoticComponent<SlotProps & RefAttributes<unknown>> = forwardRef(
    ({ children, ...props }, ref): ReactNode => {
        if (isValidElement(children)) {
            const child = children as ReactElement;
            const childRef = getElementRef(child);

            return cloneElement(child, {
                ...mergeProps(props, child.props),
                ref: childRef || ref
                    ? composeRefs(ref, childRef)
                    : undefined
            });
        }

        return children as ReactNode;
    }
);

Slot.displayName = 'Slot';
