import clsx from 'clsx';
import { HStack, HStackProps } from '@/components/primitives/layout/Stack';

export type TabsListProps = HStackProps;

export const TabsList = ({
    children,
    className = 'xw-p-3 xw-gap-2'
}: HStackProps) => (
    <HStack className={clsx('xw-flex-shrink-0 xw-mt-auto', className)}>
        {children}
    </HStack>
);

TabsList.displayName = 'Tabs.List';
