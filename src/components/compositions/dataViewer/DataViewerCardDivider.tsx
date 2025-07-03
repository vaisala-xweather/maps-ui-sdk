import { Hr } from '@/components/primitives/layout/Hr';

export interface DataViewerCardDividerProps {
    className?: string;
}

export const DataViewerCardDivider = ({
    className = 'xw-border-t-2 xw-border-slate-900'
}: DataViewerCardDividerProps) => (
    <Hr className={className} />
);

DataViewerCardDivider.displayName = 'DataViewer.CardDivider';
