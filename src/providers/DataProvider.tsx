import { createContext, useContext, ReactNode } from 'react';

interface DataProviderProps {
    data: any;
    children: ReactNode;
}

export const DataContext = createContext<any | undefined>(undefined);

export const useDataContext = () => {
    const data = useContext(DataContext);
    // if (data === undefined) {
    //     throw new Error('useData must be used within a DataProvider');
    // }
    return data;
};

export const DataProvider = ({
    children,
    data
}: DataProviderProps) => (
    <DataContext.Provider value={data}>
        {children}
    </DataContext.Provider>
);
