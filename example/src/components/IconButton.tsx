import { ComponentType, forwardRef } from 'react';
import clsx from 'clsx';
import { type IconProps, IconButton as SDKIconButton } from '@xweather/maps-ui-sdk';

export const ICON_BUTTON_STYLES = {
    base: 'text-[#C1C7CD] rounded-md text-2xl slate-900',
    hover: 'hover:border-2 hover:border-slate-600 hover:text-white',
    size: {
        sm: 'size-7',
        md: 'size-10.5'
    },
    active: 'text-white border-2 border-secondary-200'
} as const;

export interface IconButtonProps {
    icon: ComponentType<IconProps>;
    size?: 'sm' | 'md';
    isActive?: boolean;
    className?: string;
    onClick: () => void;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(({
    icon,
    onClick,
    size = 'md',
    isActive = false,
    className,
    ...rest
}, ref) => {
    const buttonClassName = clsx(
        ICON_BUTTON_STYLES.base,
        ICON_BUTTON_STYLES.size[size],
        !isActive && ICON_BUTTON_STYLES.hover,
        isActive && ICON_BUTTON_STYLES.active,
        className
    );

    return (
        <SDKIconButton
            ref={ref}
            className={buttonClassName}
            icon={icon}
            onClick={onClick}
            {...rest}
        />
    );
});

IconButton.displayName = 'IconButton';
