import { ComponentType } from 'react';
import { IconButtonProps, IconButton } from '@/components/primitives/buttons/IconButton';
import { CloseIcon } from '@/components/compositions/icons/Icon';
import { IconProps } from '@/components/primitives/display/Icon';

export interface CloseButtonProps extends Omit<IconButtonProps, 'icon'> {
    icon?: ComponentType<IconProps>;
}

export const CloseButton = ({
    id = 'close-button',
    icon = CloseIcon,
    iconProps = {},
    ...rest
}: CloseButtonProps) => {
    const mergedIconProps = {
        size: 20,
        color: 'white',
        ...iconProps
    };

    return (
        <IconButton
            id={id}
            icon={CloseIcon}
            iconProps={mergedIconProps}
            {...rest}
        />
    );
};
