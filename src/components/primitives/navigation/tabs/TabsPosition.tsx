import { PositionProvider, PositionProviderProps } from '@/providers/PositionProvider';
import { useDataContext } from '@/providers/DataProvider';

export type TabsPositionProps = PositionProviderProps;

export const TabsPosition = ({
    children,
    ...overrideProps
}: TabsPositionProps) => {
    const sharedProps = useDataContext() || {};

    const mergedProps: Omit<PositionProviderProps, 'children'> = {
        ...sharedProps,
        ...overrideProps
    };

    return (
        <PositionProvider {...mergedProps}>
            {children}
        </PositionProvider>
    );
};

TabsPosition.displayName = 'Tabs.Position';
