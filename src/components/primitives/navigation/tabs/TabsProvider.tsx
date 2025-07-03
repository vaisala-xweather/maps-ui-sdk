import { createContext, ReactNode, useContext, useState, useCallback } from 'react';

export interface TabsContextProps {
    currentTab: string | null;
    unmountOnExit?: boolean;
    isCurrent: (id: string) => boolean;
    setCurrentTab: (id: string | null) => void;
}

export const TabsContext = createContext<TabsContextProps>({
    currentTab: null,
    setCurrentTab: () => {},
    isCurrent: () => false,
    unmountOnExit: false
});

export const useTabsContext = () => useContext(TabsContext);

export interface TabsProviderProps {
    children: ReactNode;
    defaultValue?: string;
    value?: string | null;
    unmountOnExit?: boolean;
    onChange?: (value: string | null) => void;
}

export const TabsProvider = ({
    children,
    defaultValue,
    value,
    onChange,
    unmountOnExit = false
}: TabsProviderProps) => {
    const [internalValue, setInternalValue] = useState<string | null>(defaultValue ?? null);

    const currentTab = value === undefined ? internalValue : value;

    const setCurrentTab = useCallback((newValue: string | null) => {
        if (value === undefined) {
            setInternalValue(newValue);
        }
        onChange?.(newValue);
    }, [value, onChange]);

    const isCurrent = useCallback((id: string) => currentTab === id, [currentTab]);

    return (
        <TabsContext.Provider value={{
            currentTab,
            setCurrentTab,
            isCurrent,
            unmountOnExit
        }}>
            {children}
        </TabsContext.Provider>
    );
};

TabsProvider.displayName = 'Tabs.Provider';
