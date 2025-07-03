import { ReactNode, Fragment } from 'react';
import { Hr } from '@/components/primitives/layout/Hr';
import { VStack } from '@/components/primitives/layout/Stack';

export interface PanelListProps {
    children: ReactNode[],
    className?: string,
    dividerClassName?: string,
    showLastDivider?: boolean,
    showFirstDivider?: boolean
}

export const PanelList = ({
    children,
    className = '',
    dividerClassName = 'xw-opacity-20',
    showLastDivider = false,
    showFirstDivider = false
}: PanelListProps) => (
    <VStack className={className}>
        {showFirstDivider && <Hr className={dividerClassName} />}
        {children?.map((child, index) => (<Fragment key={index}>
            {child}
            {(showLastDivider ? true : index < children.length - 1) && <Hr className={dividerClassName} />}
        </Fragment>))
        }
    </VStack>
);
