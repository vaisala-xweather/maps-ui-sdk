import { forwardRef, ComponentPropsWithRef } from 'react';

export type ModalDescriptionProps = ComponentPropsWithRef<'p'>;

export const ModalDescription = forwardRef<HTMLParagraphElement, ModalDescriptionProps>((props, ref) => (
    <p ref={ref} {...props} />
));

ModalDescription.displayName = 'Modal.Description';
