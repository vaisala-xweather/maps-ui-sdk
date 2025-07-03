import clsx from 'clsx';
import * as Slider from '@radix-ui/react-slider';
import {
    ControlUnits,
    HStack,
    useUnitDisplay
} from '@xweather/maps-ui-sdk';

interface DrawRangeControlProps {
    id: string;
    value: [number, number];
    units: ControlUnits;
    className?: string;
    min?: number;
    max?: number;
    onValueChange?: (value: [number, number]) => void;
}

const SliderThumb = () => (
    <Slider.Thumb
        className="block size-3 bg-white rounded-full focus:outline-none"
    />);

export const DrawRangeControl = ({
    min = 0,
    max = 100,
    value,
    units,
    className = 'w-full gap-3',
    onValueChange
}: DrawRangeControlProps) => {
    const [rangeMin, rangeMax] = useUnitDisplay(value, units);

    return (
        <HStack
            className={clsx(
                'items-center',
                className
            )}
        >
            <div className="w-8 text-right text-xs text-white">
                {rangeMin}
            </div>
            <Slider.Root
                className="relative mx-2 flex items-center select-none touch-none flex-1 h-[25px] cursor-pointer"
                value={value}
                onValueChange={onValueChange}
                max={max}
                min={min}
                step={1}
                aria-label="Range"
            >
                <Slider.Track className="bg-[#6d6d6d] relative grow h-[2px] rounded-full">
                    <Slider.Range className="absolute bg-white rounded-full h-full" />
                </Slider.Track>
                <SliderThumb/>
                <SliderThumb/>
            </Slider.Root>
            <div className="w-8 text-xs text-white">
                {rangeMax}
            </div>
        </HStack>
    );
};
