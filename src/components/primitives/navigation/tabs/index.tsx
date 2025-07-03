import { ReactNode, CSSProperties, RefObject } from 'react';
import clsx from 'clsx';
import { VStack } from '@/components/primitives/layout/Stack';
import { DataProvider } from '@/providers/DataProvider';
import { Responsive } from '@/types/responsive';
import { Side, Align } from '@/types/position';
import { TabsProvider } from './TabsProvider';
import { TabsPosition } from './TabsPosition';
import { TabsContent } from './TabsContent';
import { TabsList } from './TabsList';
import { TabsButton } from './TabsButton';
import { TabsAnimation } from './TabsAnimation';
import { TabsAnimatedContent } from './TabsAnimatedContent';
import { TabsAnimationProvider } from './TabsAnimationProvider';

interface TabsRootProps {
    className?: string;
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

const TabsRoot = ({
    children,
    className,
    side,
    align,
    offset,
    offsetX,
    offsetY,
    position = 'relative',
    relativeToRef,
    collisionPadding,
    responsivePositioningDelay
}: TabsRootProps) => (
    <DataProvider data={{
        side,
        align,
        offset,
        offsetX,
        offsetY,
        position,
        relativeToRef,
        collisionPadding,
        responsivePositioningDelay
    }}>
        {position === 'relative' ? (
            <VStack className={clsx('xw-h-full', className)}>
                {children}
            </VStack>
        ) : (
            children
        )}
    </DataProvider>
);
TabsRoot.displayName = 'Tabs.Root';

type TabsProps = TabsRootProps;

const Tabs = (props: TabsRootProps) => <Tabs.Root {...props} />;
Tabs.displayName = 'Tabs';

Tabs.Root = TabsRoot;
Tabs.Provider = TabsProvider;
Tabs.Position = TabsPosition;
Tabs.Content = TabsContent;
Tabs.List = TabsList;
Tabs.Button = TabsButton;
Tabs.Animation = TabsAnimation;
Tabs.AnimatedContent = TabsAnimatedContent;
Tabs.AnimationProvider = TabsAnimationProvider;

/* ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
// Compound Component
export { Tabs, type TabsProps };

// Context
export { TabsContext, useTabsContext, type TabsContextProps } from './TabsProvider';
export {
    TabsAnimationContext, useTabsAnimationContext,
    type TabsAnimationContextProps
} from './TabsAnimationProvider';

// Sub-components
export { TabsRoot, type TabsRootProps };
export { TabsProvider, type TabsProviderProps } from './TabsProvider';
export { TabsPosition, type TabsPositionProps } from './TabsPosition';
export { TabsContent, type TabsContentProps } from './TabsContent';
export { TabsList, type TabsListProps } from './TabsList';
export { TabsButton, type TabsButtonProps } from './TabsButton';
export { TabsAnimation, type TabsAnimationProps } from './TabsAnimation';
export { TabsAnimatedContent, type TabsAnimatedContentProps } from './TabsAnimatedContent';
export { TabsAnimationProvider, type TabsAnimationProviderProps } from './TabsAnimationProvider';
/* ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
