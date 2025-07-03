import { forwardRef } from 'react';
import clsx from 'clsx';
import { IconButton as IconButtonType } from '@/types/button';
import { Button, ButtonProps } from './Button';

export type IconButtonProps = ButtonProps & IconButtonType;

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(({
    className = '',
    children,
    icon: Icon,
    iconProps,
    ...rest
}, ref) => (
    <Button
        ref={ref}
        className={clsx('xw-flex xw-items-center xw-justify-center xw-flex-shrink-0', className)}
        {...rest}
    >
        {children}
        <Icon {...iconProps} />
    </Button>
));

IconButton.displayName = 'IconButton';
