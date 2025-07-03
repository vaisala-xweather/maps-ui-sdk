import { ReactNode, ReactElement } from 'react';
import clsx from 'clsx';
import { calculateDimensionsFromSize, parseViewBox } from '@/utils/svg';
import InvalidDimensionError from '@/utils/error/invalidDimension';
import InvalidUnitError from '@/utils/error/invalidUnitError';

export interface IconProps {
  children?: ReactNode | ReactElement;
  size?: string | number;
  width?: string | number;
  height?: string | number;
  color?: string;
  fillColor?: string;
  strokeColor?: string;
  className?: string;
  viewBox?: string;
  transform?: string;
}

export const Icon = ({
    size,
    width,
    height,
    color = 'currentColor',
    strokeColor = '',
    className = '',
    viewBox = '0 0 24 24',
    transform,
    children
}: IconProps) => {
    try {
        const viewBoxDimensions = parseViewBox(viewBox);
        const dimensions = calculateDimensionsFromSize(
            size ?? Math.max(viewBoxDimensions?.width, viewBoxDimensions?.height),
            width ?? viewBoxDimensions?.width,
            height ?? viewBoxDimensions?.height
        );
        return (
            <svg
                className={clsx(className)}
                fill={color}
                stroke={strokeColor}
                height={dimensions.newHeight}
                width={dimensions.newWidth}
                viewBox={viewBox}
                xmlns="http://www.w3.org/2000/svg"
                transform={transform}
            >
                {children}
            </svg>
        );
    } catch (error) {
        if (error instanceof InvalidDimensionError || error instanceof InvalidUnitError) {
            console.error(error.message);
            return null;
        }
        throw error;
    }
};
