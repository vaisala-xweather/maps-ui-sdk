import { CloseButton, CloseButtonProps } from '@/components/compositions/buttons/CloseButton';

export type ModalCloseButtonProps = CloseButtonProps;

export const ModalCloseButton = (props: ModalCloseButtonProps) => (
    <CloseButton {...props} />
);
ModalCloseButton.displayName = 'Modal.CloseButton';
