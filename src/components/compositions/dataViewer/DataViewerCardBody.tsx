export type DataViewerCardBodyProps = {
    children: React.ReactNode;
    className?: string;
};

export const DataViewerCardBody = ({
    children,
    className = 'xw-text-black'
}: DataViewerCardBodyProps) => (
    <div className={className}>
        {children}
    </div>
);

DataViewerCardBody.displayName = 'DataViewer.CardBody';
