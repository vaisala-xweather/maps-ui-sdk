import { createPortal } from 'react-dom';

interface PortalProps {
    target?: Element
    children: any
}

export const Portal = ({ children }: PortalProps) => {
    const target = document.body;
    return createPortal(children, target);
};
