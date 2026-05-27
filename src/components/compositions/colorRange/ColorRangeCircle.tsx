import { useContext } from 'react';
import { ColorRangeContext } from '@/providers/ColorRangeProvider';
import { Circle } from '@/components/primitives/display/Circle';
import { getHexCodeFromColorScale } from '@/utils/color';
import { ColorRangeEndpointContext, ColorRangeEndpointValue } from './ColorRangeEndpointProvider';

export interface ColorRangeCircleProps {
    size?: number | number[];
    color?: string;
    type?: Exclude<ColorRangeEndpointValue, null>;
}

export const ColorRangeCircle = ({ size = [16, 10], color, type }: ColorRangeCircleProps) => {
    const colorRangeContext = useContext(ColorRangeContext);
    const endpointType = useContext(ColorRangeEndpointContext);
    const resolvedType = type ?? endpointType ?? 'max';

    const sizes = Array.isArray(size) ? size : [size, size];
    const [outerCircleDiameter, innerCircleDiameter] = sizes;
    const valueFromColorRangeContext = resolvedType === 'min' ? colorRangeContext?.min : colorRangeContext?.max;
    const colorFromColorScale = colorRangeContext
        ? getHexCodeFromColorScale(
            valueFromColorRangeContext,
            colorRangeContext.colorScale,
            colorRangeContext.colorScaleUnitConverter
        )
        : undefined;

    return (
        <Circle
            diameter={outerCircleDiameter}
            className="xw-border xw-border-slate-200 xw-flex xw-justify-center xw-items-center xw-p-0.5">
            <Circle
                diameter={innerCircleDiameter}
                color={color ?? colorFromColorScale} />
        </Circle>
    );
};
