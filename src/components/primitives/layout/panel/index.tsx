import { ReactNode } from 'react';
import { PanelHeader } from './PanelHeader';
import { PanelBody } from './PanelBody';
import { PanelGroup } from './PanelGroup';
import { PanelList } from './PanelList';
import { PanelItem } from './PanelItem';

interface PanelProps {
    children: ReactNode,
    className?: string
}

export const Panel = ({ children, className = '' }: PanelProps) => (
    <div className={className}>
        {children}
    </div>
);

Panel.Header = PanelHeader;
Panel.Body = PanelBody;
Panel.Group = PanelGroup;
Panel.List = PanelList;
Panel.Item = PanelItem;
