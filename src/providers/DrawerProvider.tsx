import { createContext, useState, useContext, ReactNode } from 'react';

interface DrawerContextProps {
    isOpen: boolean,
    setIsOpen: (isOpen: boolean) => void;
    open: () => void;
    close: () => void;
}

interface DrawerProviderProps {
    children: ReactNode
}

export const DrawerContext = createContext<DrawerContextProps>({
    isOpen: false,
    setIsOpen: () => {},
    open: () => {},
    close: () => {}
});

export const useDrawerContext = () => useContext(DrawerContext);

export const DrawerProvider = ({
    children
}: DrawerProviderProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);

    return (
        <DrawerContext.Provider
            value={{
                isOpen,
                open,
                close,
                setIsOpen
            }}>
            {children}
        </DrawerContext.Provider>
    );
};
