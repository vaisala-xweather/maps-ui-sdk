import { useColorRangeContext } from '@/providers/ColorRangeProvider';
import { Circle } from '@/components/primitives/display/Circle';
import { getHexCodeFromColorScale } from '@/utils/color';
import { useColorRangeEndpointContext } from './ColorRangeEndpointProvider';

export interface ColorRangeCircleProps {
    size?: number | number[];
    color?: string;
}

export const ColorRangeCircle = ({ size = [16, 10], color }: ColorRangeCircleProps) => {
    const { colorScale, colorScaleUnitConverter, min, max } = useColorRangeContext();
    const type = useColorRangeEndpointContext();

    const sizes = Array.isArray(size) ? size : [size, size];
    const [outerCircleDiameter, innerCircleDiameter] = sizes;
    const value = type === 'min' ? min : max;
    const colorFromColorScale = getHexCodeFromColorScale(value, colorScale, colorScaleUnitConverter);

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
