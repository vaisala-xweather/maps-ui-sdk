import { ReactNode, useContext } from 'react';
import clsx from 'clsx';
import { useColorRangeContext } from '@/providers/ColorRangeProvider';
import { ColorRangeEndpointContext } from './ColorRangeEndpointProvider';

export interface ColorRangeLabelProps {
    children?: string | ReactNode;
    className?: string;
}

export const ColorRangeLabel = ({ children, className = 'xw-text-lg' }: ColorRangeLabelProps) => {
    const type = useContext(ColorRangeEndpointContext);
    const { min, max } = useColorRangeContext();
    const value = type === 'min' ? min : max;

    return (
        <p className={clsx(
            'xw-min-w-7 xw-max-w-7',
            type === 'min' ? 'xw-mr-1 xw-text-right' : 'xw-ml-1',
            className
        )}>
            {children ?? value}
        </p>
    );
};
