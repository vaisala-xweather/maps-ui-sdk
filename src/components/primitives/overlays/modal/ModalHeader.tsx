import clsx from 'clsx';
import { HStack, HStackProps } from '@/components/primitives/layout/Stack';

export type ModalHeaderProps = HStackProps;

export const ModalHeader = ({
    children,
    className = 'p-4',
    ...rest
}: ModalHeaderProps) => (
    <HStack className={clsx('xw-items-center', className)} {...rest}>
        {children}
    </HStack>
);
ModalHeader.displayName = 'Modal.Header';
