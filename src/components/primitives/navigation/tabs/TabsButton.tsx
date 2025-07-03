import { MouseEventHandler } from 'react';
import { IconButton, IconButtonProps } from '@/components/primitives/buttons/IconButton';
import { THEME } from '@/constants/theme';
import { useTabsContext } from './TabsProvider';

export interface TabsButtonProps extends Omit<IconButtonProps, | 'onClick'> {
    value: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

export const TabsButton = ({
    id,
    className,
    icon,
    iconProps,
    value,
    onClick,
    ...rest
}: TabsButtonProps) => {
    const { setCurrentTab } = useTabsContext();
    const buttonId = id || `tabs-button-${value}`;

    const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
        setCurrentTab(value);
        onClick?.(event);
    };

    const mergedIconProps = {
        size: 24,
        color: THEME.colors['secondary-200'],
        ...iconProps
    };

    return (
        <IconButton
            id={buttonId}
            className={className}
            icon={icon}
            iconProps={mergedIconProps}
            onClick={handleClick}
            {...rest}
        />
    );
};

TabsButton.displayName = 'Tabs.Button';
