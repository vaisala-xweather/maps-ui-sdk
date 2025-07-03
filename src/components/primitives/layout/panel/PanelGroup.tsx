import { ReactNode } from 'react';
import { VStack } from '@/components/primitives/layout/Stack';

export interface PanelGroupProps {
    children: ReactNode
    title: string | ReactNode,
    titleClassName?: string,
    containerClassName?: string,
}

export const PanelGroup = ({
    children,
    title,
    titleClassName = '',
    containerClassName = ''
}: PanelGroupProps) => (
    <VStack className={containerClassName}>
        <h3 className={titleClassName}>{title}</h3>
        {children}
    </VStack>
);
