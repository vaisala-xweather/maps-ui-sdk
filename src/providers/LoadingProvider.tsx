import { createContext, useState, ReactNode, useRef, useContext, useEffect, useCallback } from 'react';

interface LoadingContextProps {
    loading: boolean;
    setLoading: (value: boolean, delay?: number) => void;
}

export interface LoadingProviderProps {
    children: ReactNode;
}

export const LoadingContext = createContext<LoadingContextProps>({
    loading: false,
    setLoading: () => {}
});

export const useLoadingContext = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoadingContext must be used within a LoadingProvider');
    }
    return context;
};

export const LoadingProvider = ({ children }: LoadingProviderProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const loadingRef = useRef(isLoading);
    const timeoutRef = useRef<number | undefined>();

    const setLoading = useCallback((value: boolean, delay?: number) => {
        if (isLoading && value) {
            return;
        }

        loadingRef.current = value;

        clearTimeout(timeoutRef.current);

        timeoutRef.current = window.setTimeout(() => {
            setIsLoading(loadingRef.current);
        }, (delay ?? value ? 300 : 500));

        if (!value) {
            window.setTimeout(() => {
                if (!loadingRef.current) {
                    setIsLoading(false);
                }
            }, delay ?? 500);
        }
    }, []);

    useEffect(() => () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }, []);

    return (
        <LoadingContext.Provider value={{ loading: isLoading, setLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};

LoadingProvider.displayName = 'Loading.Provider';
