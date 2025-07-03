import { MouseEventHandler } from 'react';
import { useVisibilityContext } from '@/providers/VisibilityProvider';
import { CloseButton, CloseButtonProps } from '@/components/compositions/buttons/CloseButton';

export type PopoverCloseProps = CloseButtonProps;

export const PopoverClose = ({
    id = 'popover-close-button',
    className,
    icon,
    iconProps,
    onClick,
    ...rest
}: PopoverCloseProps) => {
    const { setIsVisible } = useVisibilityContext();

    const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
        setIsVisible(false);
        onClick?.(event);
    };

    const mergedIconProps = {
        size: 20,
        color: 'white',
        ...iconProps
    };

    return (
        <CloseButton
            id={id}
            className={className}
            icon={icon}
            iconProps={mergedIconProps}
            onClick={handleClick}
            {...rest}
        />
    );
};
