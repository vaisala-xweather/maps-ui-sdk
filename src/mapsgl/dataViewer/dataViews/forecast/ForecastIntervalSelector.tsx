import { ReactNode } from 'react';
import { Select } from '@/components/primitives/controls/Select';
import { Slot } from '@/components/primitives/utils/Slot';
import { Option } from '@/types/control';
import { useForecastIntervals } from './ForecastProvider';

export interface ForecastIntervalSelectorRenderProps {
    value: string;
    name: string;
    options: Option[];
    onValueChange: (value: string) => void;
    className?: string;
}

export interface ForecastIntervalSelectorProps {
    name?: string;
    className?: string;
    asChild?: boolean;
    children?: ReactNode | ((props: ForecastIntervalSelectorRenderProps) => ReactNode);
}

export const ForecastIntervalSelector = ({
    name = 'forecast-interval',
    className = 'xw-border-0 xw-text-base',
    asChild = false,
    children
}: ForecastIntervalSelectorProps) => {
    const {
        intervalOptions,
        activeIntervalId,
        setActiveIntervalId
    } = useForecastIntervals();

    if (intervalOptions.length <= 1) {
        return null;
    }

    const renderProps: ForecastIntervalSelectorRenderProps = {
        value: activeIntervalId,
        options: intervalOptions,
        onValueChange: setActiveIntervalId,
        className,
        name
    };

    if (typeof children === 'function') {
        return children(renderProps);
    }

    if (asChild) {
        return children
            ? <Slot {...renderProps}>{children}</Slot>
            : null;
    }

    return (
        <Select
            name={name}
            className={className}
            value={activeIntervalId}
            options={intervalOptions}
            onValueChange={setActiveIntervalId}
        />
    );
};

ForecastIntervalSelector.displayName = 'Forecast.IntervalSelector';
