import clsx from 'clsx';
import { VStack, type VStackProps } from './Stack';

export type ScrollableAreaProps = VStackProps;

export const ScrollableArea = ({
    children,
    className
}: ScrollableAreaProps) => (
    <div className={clsx('xw-overflow-y-auto xw-overflow-x-hidden', className)}>
        <VStack
            tabIndex={-1}
            className="xw-h-full"
        >
            {children}
        </VStack>
    </div>
);
