import { Heading, HeadingProps } from '@/components/primitives/text/Heading';

export type ModalTitleProps = HeadingProps;

export const ModalTitle = ({ children, ...rest }: ModalTitleProps) => (
    <Heading level={2} {...rest}>{children}</Heading>
);
ModalTitle.displayName = 'Modal.Title';
