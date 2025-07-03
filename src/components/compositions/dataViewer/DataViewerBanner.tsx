import { ReactNode } from 'react';
import { HStack } from '@/components/primitives/layout/Stack';

export type DataViewerBannerProps = {
    children: ReactNode;
    className?: string;
};

export const DataViewerBanner = ({ children, className }: DataViewerBannerProps) => (
    <HStack className={className}>
        {children}
    </HStack>
);

DataViewerBanner.displayName = 'DataViewer.Banner';
