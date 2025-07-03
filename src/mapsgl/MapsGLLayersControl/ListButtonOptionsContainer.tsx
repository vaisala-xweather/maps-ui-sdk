import { ReactNode } from 'react';
import { VStack } from '@/components/primitives/layout/Stack';

export interface ListButtonOptionsContainerProps {
    children: ReactNode
}

export const ListButtonOptionsContainer = ({ children }: ListButtonOptionsContainerProps) => (
    <VStack className="xw-w-full xw-px-2 xw-py-1 xw-pb-3 xw-gap-1 xw-bg-white xw-text-slate-800">
        {children}
    </VStack>
);
