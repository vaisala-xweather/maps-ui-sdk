import { forwardRef } from 'react';
import { ControlUnits } from '@/types/control';
import { ButtonProps, Button } from '@/components/primitives/buttons/Button';
import { useUnitDisplay } from '@/hooks/useUnitDisplay';

export interface UnitButtonProps extends Omit<ButtonProps, 'label'> {
    label: number;
    units: ControlUnits;
    valueFormatter?: (value: number) => string | null | undefined;
}

export const UnitButton = forwardRef<HTMLButtonElement, UnitButtonProps>(({
    label,
    units,
    valueFormatter,
    ...rest
}, ref) => {
    const unitText = useUnitDisplay(label, units, valueFormatter);

    return <Button label={unitText} {...rest} ref={ref} />;
});

UnitButton.displayName = 'UnitButton';
