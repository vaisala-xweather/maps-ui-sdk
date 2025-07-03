import { ReactNode } from 'react';
import { HTMLMotionProps } from 'framer-motion';
import { TabsAnimationProvider, AnimatorComponent } from './TabsAnimationProvider';

export interface TabsAnimationProps extends HTMLMotionProps<'div'> {
    children: ReactNode;
    Animator?: AnimatorComponent;
}

export const TabsAnimation = ({
    children,
    Animator,
    ...motionProps
}: TabsAnimationProps) => (
    <TabsAnimationProvider value={{ Animator, ...motionProps }}>
        {children}
    </TabsAnimationProvider>
);

TabsAnimation.displayName = 'Tabs.Animation';
