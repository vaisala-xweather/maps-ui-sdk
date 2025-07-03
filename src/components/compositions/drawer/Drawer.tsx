/* eslint-disable max-len */
import { ReactNode, ReactElement, useEffect } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useAnchorContext } from '@/providers/AnchorProvider';
import { ANCHOR } from '@/constants/anchor';
import { ModalContextType, useModalContext } from '@/components/primitives/overlays/modal/ModalProvider';
import { useDrawerContext } from '@/providers/DrawerProvider';
import { DYNAMIC_EASE } from '@/constants/animation';
import { CloseButton } from '@/components/compositions/buttons/CloseButton';

interface DrawerProps {
    className?: string;
    children: ReactNode | ReactElement,
    isExpanded?: boolean
    onOpen?: () => void
    onClose?: () => void
}

export const Drawer = ({
    children,
    onOpen,
    onClose,
    className
}: DrawerProps) => {
    const { isOpen, close } = useDrawerContext();
    const anchor = useAnchorContext();
    const { hideModal }: ModalContextType = useModalContext();

    useEffect(() => {
        if (isOpen && onOpen) {
            onOpen();
        }

        /* eslint-disable react-hooks/exhaustive-deps */
    }, [isOpen]);

    const variants = {
        open: { x: anchor === ANCHOR.right ? '-100%' : 0 },
        closed: { x: anchor === ANCHOR.right ? '100%' : '-100%' }
    };

    const handleCollapse = () => {
        hideModal();
        close();

        if (onClose) {
            onClose();
        }
    };

    return (
        <motion.div
            id="Drawer"
            className={clsx('absolute min-w-65 max-w-65 h-full text-white top-0 bottom-0 bg-black z-70', className)}
            initial="closed"
            animate={isOpen ? 'open' : 'closed'}
            variants={variants}
            transition={{ duration: 0.3, ease: DYNAMIC_EASE }}
        >
            <CloseButton
                id="drawer"
                className="xw-absolute xw-top-4 xw-right-3 xw-bg-[#2F343D] xw-justify-center xw-w-7 xw-h-7 xw-rounded-full xw-text-white"
                iconProps={{ size: 10 }}
                onClick={handleCollapse}
            />
            {children}
        </motion.div>
    );
};
