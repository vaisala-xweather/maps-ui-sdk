import { createContext, useContext, ReactNode, useState } from 'react';

interface VisibilityContextProps {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  toggleVisibility: () => void;
  show: () => void;
  hide: () => void;
}

export const VisibilityContext = createContext<VisibilityContextProps | undefined>(undefined);

export const useVisibilityContext = () => {
    const context = useContext(VisibilityContext);
    if (!context) {
        throw new Error('useVisibilityContext must be used within a VisibilityProvider');
    }
    return context;
};

export interface VisibilityProviderProps {
  children: ReactNode;
  isVisible?: boolean;
  onVisibilityChange?: (isVisible: boolean) => void;
}

export const VisibilityProvider = ({
    children,
    isVisible: isVisibleOverride,
    onVisibilityChange
}: VisibilityProviderProps) => {
    const [internalIsVisible, setInternalIsVisible] = useState(false);

    const isVisible = isVisibleOverride === undefined ? internalIsVisible : isVisibleOverride;
    const setIsVisible = onVisibilityChange === undefined ? setInternalIsVisible : onVisibilityChange;

    const show = () => setIsVisible(true);
    const hide = () => setIsVisible(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    return (
        <VisibilityContext.Provider
            value={{
                isVisible,
                setIsVisible,
                toggleVisibility,
                show,
                hide
            }}>
            {children}
        </VisibilityContext.Provider>
    );
};
