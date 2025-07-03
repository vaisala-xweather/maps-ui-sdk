import { ControlUnits } from '@/types/control';
import { useUnitDisplay } from '@/hooks/useUnitDisplay';

export interface UnitValueProps {
    value: number;
    units: ControlUnits;
    className?: string;
    formatter?: (value: number) => string | null | undefined;
}

export const UnitValue = ({
    value,
    units,
    formatter,
    className
}: UnitValueProps) => {
    const displayValue = useUnitDisplay(value, units, formatter);

    return (
        <span className={className}>
            {displayValue}
        </span>
    );
};
