import { MouseEvent } from 'react';
import { CloseButton } from '@/components/compositions/buttons/CloseButton';
import { useModalContext } from '@/components/primitives/overlays/modal/ModalProvider';
import { THEME } from '@/constants/theme';
import { IconButtonWithDefaultsProps } from '@/types/button';

export type DataViewerCloseButtonProps = IconButtonWithDefaultsProps;

export const DataViewerCloseButton = ({
    id = 'data-viewer-close-button',
    className,
    icon,
    iconProps,
    onClick
}: DataViewerCloseButtonProps) => {
    const { hideModal } = useModalContext();

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        hideModal();
        onClick?.(event);
    };

    const mergedIconProps = {
        size: 12,
        color: THEME.colors['slate-500'],
        ...iconProps
    };

    return (
        <CloseButton
            id={id}
            className={className}
            icon={icon}
            iconProps={mergedIconProps}
            onClick={handleClick}
        />
    );
};

DataViewerCloseButton.displayName = 'DataViewer.CloseButton';
