import { ReactNode } from 'react';
import { CenterXPositioner } from '@/components/primitives/layout/CenterXPositioner';
import { TimelineTimeText } from './TimelineTimeText';

export interface TimelineTimeProgressIndicatorProps {
    children?: string | ReactNode;
}

export const TimelineTimeProgressIndicator = ({
    children
}: TimelineTimeProgressIndicatorProps) => (
    <CenterXPositioner
        className="xw-timeline-time-progress-indicator xw-bottom-8 xw-w-20 xw-rounded-full xw-absolute
            xw-flex xw-justify-center xw-text-xs xw-p-2 xw-text-slate-900 xw-font-semibold xw-bg-white">
        {children || <TimelineTimeText />}
        <div className="xw-absolute xw-flex xw-justify-center xw-top-full xw-h-8 xw-w-1 xw-bg-white">
            <div className="xw-absolute xw-top-7 xw-rounded-full xw-w-2 xw-h-2 xw-bg-white"></div>
        </div>
    </CenterXPositioner>
);

TimelineTimeProgressIndicator.displayName = 'Timeline.TimeProgressIndicator';
