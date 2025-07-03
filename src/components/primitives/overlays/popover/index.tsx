import { VisibilityProvider, VisibilityProviderProps } from '@/providers/VisibilityProvider';
import { Heading } from '@/components/primitives/text/Heading';
import { PopoverTrigger } from './PopoverTrigger';
import { PopoverContent } from './PopoverContent';
import { PopoverPosition } from './PopoverPosition';
import { PopoverArrow } from './PopoverArrow';
import { PopoverClose } from './PopoverClose';

type PopoverRootProps = VisibilityProviderProps;

const PopoverRoot = ({ children, ...rest }: PopoverRootProps) => (
    <VisibilityProvider {...rest}>
        {children}
    </VisibilityProvider>
);
PopoverRoot.displayName = 'Popover.Root';

type PopoverProps = PopoverRootProps;

const Popover = ({ children, ...rest }: PopoverProps) => (
    <Popover.Root {...rest}>
        {children}
    </Popover.Root>
);
Popover.displayName = 'Popover';

Popover.Root = PopoverRoot;
Popover.Trigger = PopoverTrigger;
Popover.Content = PopoverContent;
Popover.Position = PopoverPosition;
Popover.Arrow = PopoverArrow;
Popover.Close = PopoverClose;
Popover.Title = Heading;

/* ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
// Compound Component
export { Popover, type PopoverProps };

// Sub-components
export { PopoverRoot, type PopoverRootProps };
export { PopoverTrigger, type PopoverTriggerProps } from './PopoverTrigger';
export { PopoverContent, type PopoverContentProps } from './PopoverContent';
export { PopoverPosition, type PopoverPositionProps } from './PopoverPosition';
export { PopoverArrow, type PopoverArrowProps } from './PopoverArrow';
export { PopoverClose, type PopoverCloseProps } from './PopoverClose';
export { Heading as PopoverTitle, type HeadingProps as PopoverTitleProps } from '@/components/primitives/text/Heading';
/* ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
