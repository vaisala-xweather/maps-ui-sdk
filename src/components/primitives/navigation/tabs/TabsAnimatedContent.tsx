import { ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import { POSITION } from '@/constants/position';
import { Fade } from '@/components/primitives/animation/Fade';
import { useTabContent } from './useTabContent';
import { useTabsAnimationContext } from './TabsAnimationProvider';

export interface TabsAnimatedContentProps {
    children: ReactNode;
    value: string;
    className?: string;
    unmountOnExit?: boolean;
}

export const TabsAnimatedContent = ({
    children,
    value,
    className = '',
    unmountOnExit
}: TabsAnimatedContentProps) => {
    const {
        isVisible,
        effectiveUnmountOnExit,
        style,
        ref,
        contentClasses,
        position
    } = useTabContent(value, className, unmountOnExit);
    const { Animator = Fade, ...motionProps } = useTabsAnimationContext();

    const animatedContent = (
        <Animator
            key={value}
            className={contentClasses}
            ref={ref}
            style={style}
            animate={isVisible ? 'visible' : 'hidden'}
            {...motionProps}
        >
            {children}
        </Animator>
    );

    return (
        (position === POSITION.fixed || position === POSITION.absolute)
            ? <AnimatePresence mode="wait">
                {
                    (isVisible || !effectiveUnmountOnExit) && animatedContent
                }
            </AnimatePresence>
            : (isVisible || !effectiveUnmountOnExit) && animatedContent
    );
};

TabsAnimatedContent.displayName = 'Tabs.AnimatedContent';
