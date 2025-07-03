import { ReactNode } from 'react';
import clsx from 'clsx';
import { Modal, ModalRootProps, ModalTitle } from '@/components/primitives/overlays/modal';
import { DataViewerCard } from './DataViewerCard';
import { DataViewerDataWrapper } from './DataViewerDataWrapper';
import { DataViewerHeader } from './DataViewerHeader';
import { DataViewerBody } from './DataViewerBody';
import { DataViewerBanner } from './DataViewerBanner';
import { DataViewerCloseButton } from './DataViewerCloseButton';
import { DataViewerCardBody } from './DataViewerCardBody';
import { DataViewerCardTitle } from './DataViewerCardTitle';
import { DataViewerCardDivider } from './DataViewerCardDivider';
import { DataViewerLoadingFallback } from './DataViewerLoadingFallback';

type DataViewerRootProps = {
    id?: string;
    children: ReactNode;
    className?: string;
};

const DataViewerRoot = ({
    id = 'data-viewer',
    className,
    children
}: DataViewerRootProps) => (
    <Modal
        id={id}
        className={clsx(
            'xw-overflow-hidden xw-flex xw-flex-col xw-sm:xw-flex-none xw-relative',
            className
        )}
    >
        {children}
    </Modal>
);
DataViewerRoot.displayName = 'DataViewer.Root';

type DataViewerProps = DataViewerRootProps;

const DataViewer = ({ children, ...rest }: DataViewerProps) => (
    <DataViewer.Root {...rest}>
        {children}
    </DataViewer.Root>
);
DataViewer.displayName = 'DataViewer';

DataViewer.Root = DataViewerRoot;
DataViewer.Header = DataViewerHeader;
DataViewer.Banner = DataViewerBanner;
DataViewer.Body = DataViewerBody;
DataViewer.Card = DataViewerCard;
DataViewer.CardBody = DataViewerCardBody;
DataViewer.CardTitle = DataViewerCardTitle;
DataViewer.CardDivider = DataViewerCardDivider;
DataViewer.DataWrapper = DataViewerDataWrapper;
DataViewer.CloseButton = DataViewerCloseButton;
DataViewer.Title = ModalTitle;
DataViewer.LoadingFallback = DataViewerLoadingFallback;

/* ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
// Compound Component
export { DataViewer, type DataViewerProps };

// Sub-components
export { DataViewerRoot, type DataViewerRootProps };
export { DataViewerHeader, type DataViewerHeaderProps } from './DataViewerHeader';
export { DataViewerBanner, type DataViewerBannerProps } from './DataViewerBanner';
export { DataViewerBody, type DataViewerBodyProps } from './DataViewerBody';
export { DataViewerCard, type DataViewerCardProps } from './DataViewerCard';
export { DataViewerCardBody, type DataViewerCardBodyProps } from './DataViewerCardBody';
export { DataViewerCardTitle, type DataViewerCardTitleProps } from './DataViewerCardTitle';
export { DataViewerCardDivider, type DataViewerCardDividerProps } from './DataViewerCardDivider';
export { DataViewerDataWrapper, type DataViewerDataWrapperProps } from './DataViewerDataWrapper';
export { DataViewerCloseButton, type DataViewerCloseButtonProps } from './DataViewerCloseButton';
export { DataViewerLoadingFallback, type DataViewerLoadingFallbackProps } from './DataViewerLoadingFallback';
export {
    ModalTitle as DataViewerTitle,
    type ModalTitleProps as DataViewerTitleProps
} from '@/components/primitives/overlays/modal';
/* ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
