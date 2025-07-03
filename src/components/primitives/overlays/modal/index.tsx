import clsx from 'clsx';
import { FadePresence, FadeProps } from '@/components/primitives/animation/Fade';
import { useModalContext, ModalContextType, ModalProvider } from './ModalProvider';
import { ModalHeader } from './ModalHeader';
import { ModalBody } from './ModalBody';
import { ModalFooter } from './ModalFooter';
import { ModalCloseButton } from './ModalCloseButton';
import { ModalTitle } from './ModalTitle';
import { ModalDescription } from './ModalDescription';

interface ModalRootProps extends Omit<FadeProps, 'isPresent'> {
    id?: string;
}

const ModalRoot = ({
    id,
    className = '',
    children,
    ...rest
}: ModalRootProps) => {
    const { modalData }: ModalContextType = useModalContext();

    return (
        <FadePresence
            isPresent={modalData?.id === id}
            className={clsx('xw-absolute', className)}
            {...rest}>
            {children}
        </FadePresence>
    );
};
ModalRoot.displayName = 'Modal.Root';

type ModalProps = ModalRootProps;

const Modal = (props: ModalProps) => <Modal.Root {...props} />;
Modal.displayName = 'Modal';

Modal.Root = ModalRoot;
Modal.Provider = ModalProvider;
Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
Modal.CloseButton = ModalCloseButton;
Modal.Title = ModalTitle;
Modal.Description = ModalDescription;

/* ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
// Compound Component
export { Modal, type ModalProps };

// Context
export { ModalContext, useModalContext, ModalDataDefault } from './ModalProvider';
export type { ModalContextType, ModalData } from './ModalProvider';

// Sub-components
export { ModalRoot, type ModalRootProps };
export { ModalProvider, type ModalProviderProps } from './ModalProvider';
export { ModalHeader, type ModalHeaderProps } from './ModalHeader';
export { ModalBody, type ModalBodyProps } from './ModalBody';
export { ModalFooter, type ModalFooterProps } from './ModalFooter';
export { ModalCloseButton, type ModalCloseButtonProps } from './ModalCloseButton';
export { ModalTitle, type ModalTitleProps } from './ModalTitle';
export { ModalDescription, type ModalDescriptionProps } from './ModalDescription';
/* ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
