import { createContext, useContext, ReactNode } from 'react';
import { AnchorValue } from '@/types/anchor';

export const AnchorContext = createContext<AnchorValue>('left');

export const useAnchorContext = () => useContext(AnchorContext);

export interface AnchorProviderProps {
    children: ReactNode;
    anchor: AnchorValue;
}

export const AnchorProvider = ({
    children,
    anchor
}: AnchorProviderProps) => (
    <AnchorContext.Provider value={anchor}>
        {children}
    </AnchorContext.Provider>
);
