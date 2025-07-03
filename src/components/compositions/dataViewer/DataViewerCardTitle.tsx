import { Heading, HeadingProps } from '@/components/primitives/text/Heading';

export type DataViewerCardTitleProps = HeadingProps;

export const DataViewerCardTitle = ({
    children,
    className = 'xw-text-base xw-text-black xw-font-semibold',
    level = 3
}: DataViewerCardTitleProps) => (
    <Heading className={className} level={level}>
        {children}
    </Heading>
);

DataViewerCardTitle.displayName = 'DataViewer.CardTitle';
