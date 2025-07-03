import { createContext, useContext, ReactNode, ComponentType } from 'react';
import { HTMLMotionProps } from 'framer-motion';
import { Fade } from '@/components/primitives/animation/Fade';

export type AnimatorComponent = ComponentType<HTMLMotionProps<'div'> & { [key: string]: any }>;

export interface TabsAnimationContextProps {
  Animator?: AnimatorComponent;
}

const defaultContext: TabsAnimationContextProps = {
    Animator: Fade
};

export const TabsAnimationContext = createContext<TabsAnimationContextProps>(defaultContext);

export const useTabsAnimationContext = () => useContext(TabsAnimationContext);

export interface TabsAnimationProviderProps {
    children: ReactNode;
    value: TabsAnimationContextProps
}

export const TabsAnimationProvider = ({
    children,
    value
}: TabsAnimationProviderProps) => (
    <TabsAnimationContext.Provider value={{ ...defaultContext, ...value }}>
        {children}
    </TabsAnimationContext.Provider>
);

TabsAnimationProvider.displayName = 'Tabs.AnimationProvider';
