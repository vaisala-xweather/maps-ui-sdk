import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { get } from '@aerisweather/javascript-utils';
import { parseISO } from 'date-fns';
import { useDataContext } from '@/providers/DataProvider';
import { useSettingsContext } from '@/providers/SettingsProvider';
import { UnitsByMeasurementType } from '@/types/units';

export interface ConditionsContextValue {
    conditions: Record<string, any> | null;
    units: UnitsByMeasurementType | null;
    date: Date | null;
}

export const ConditionsContext = createContext<ConditionsContextValue | undefined>(undefined);

export const useConditionsContext = () => {
    const context = useContext(ConditionsContext);
    if (!context) {
        throw new Error(
            'useConditionsContext must be used within <ConditionsProvider>.'
        );
    }
    return context;
};

export interface ConditionsProviderProps {
    children: ReactNode;
}

export const ConditionsProvider = ({
    children
}: ConditionsProviderProps) => {
    const { data } = useDataContext();
    const { units } = useSettingsContext();
    const conditions = get(data, '0.periods.0');
    const date = conditions?.dateTimeISO ? parseISO(conditions.dateTimeISO) : null;

    const value = useMemo(() => ({
        conditions,
        units,
        date
    }), [conditions, units, date]);

    return (
        <ConditionsContext.Provider value={value}>
            {children}
        </ConditionsContext.Provider>
    );
};
