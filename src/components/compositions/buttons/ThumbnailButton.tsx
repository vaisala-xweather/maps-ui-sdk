import { forwardRef } from 'react';
import { useSettingsContext } from '@/providers/SettingsProvider';
import { ColorScale } from '@/types/colors';
import { gradientFromColorStops } from '@/utils/color';
import { HStack } from '@/components/primitives/layout/Stack';
import { ButtonProps, Button } from '@/components/primitives/buttons/Button';

export interface ThumbnailButtonProps extends ButtonProps {
    value: string;
}

export const ThumbnailButton = forwardRef<HTMLButtonElement, ThumbnailButtonProps>(({
    id,
    value,
    label,
    children,
    ...rest
}, ref) => {
    const { colorScales } = useSettingsContext();

    const data = colorScales && id ? colorScales[id] : null;
    let colorStops: ColorScale = [];
    let color = '';

    if (data?.stops) {
        colorStops = data.stops;
    }

    if (typeof value === 'string') {
        color = value;
    }

    return (
        <Button id={id} value={value} {...rest} ref={ref}>
            <HStack className="xw-items-center">
                <div
                    className="xw-preview xw-h-5 xw-w-10 xw-rounded xw-mr-2 xw-border-black xw-border"
                    style={{
                        background: colorStops
                            ? gradientFromColorStops(colorStops)
                            : color
                    }}
                ></div>
                {children || label}
            </HStack>
        </Button>
    );
});

ThumbnailButton.displayName = 'ThumbnailButton';
