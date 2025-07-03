import { ComponentType, MouseEventHandler } from 'react';
import { IconButtonProps } from '@/components/primitives/buttons/IconButton';
import { IconProps } from '@/components/primitives/display/Icon';

export interface IconButton {
    icon: ComponentType<IconProps>;
    iconProps?: IconProps;
}

export interface IconButtonWithDefaultsProps extends Omit<IconButtonProps, 'icon' | 'onClick'> {
    icon?: ComponentType<IconProps>;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}
