import { ReactNode } from 'react';

interface CircleProps {
  diameter?: number;
  color?: string;
  className?: string;
  children?: ReactNode
}

export const Circle = ({
    children,
    diameter,
    color,
    className = ''
}: CircleProps) => (
    <div
        className={`xw-rounded-full xw-shrink-0 ${className}`}
        style={{
            width: diameter ? `${diameter}px` : '100%',
            height: diameter ? `${diameter}px` : '100%',
            ...(color && { backgroundColor: color })
        }}
    >
        {children}
    </div>
);
