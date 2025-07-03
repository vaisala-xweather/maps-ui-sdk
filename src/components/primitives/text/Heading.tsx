import React from 'react';
import clsx from 'clsx';

export interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
}

export const Heading = ({
    level = 2,
    children,
    className = 'xw-text-[13px] xw-underline xw-underline-offset-4'
}: HeadingProps) => {
    const Tag = `h${level}` as keyof JSX.IntrinsicElements;
    return (
        <Tag className={clsx('xw-font-semibold', className)}>
            {children}
        </Tag>
    );
};
