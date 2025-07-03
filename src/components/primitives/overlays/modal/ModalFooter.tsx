import { HStack, HStackProps } from '@/components/primitives/layout/Stack';

export type ModalFooterProps = HStackProps;

export const ModalFooter = ({
    children,
    className = 'justify-end',
    ...rest
}: ModalFooterProps) => (
    <HStack className={className} {...rest}>
        {children}
    </HStack>
);
ModalFooter.displayName = 'Modal.Footer';
