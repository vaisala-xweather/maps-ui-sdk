import { TimelineProvider, type TimelineProviderProps } from '@/providers/TimelineProvider';
import { CenterXPositioner } from '@/components/primitives/layout/CenterXPositioner';
import { TimelineContainer } from './TimelineContainer';
import { TimelineAnimationControl } from './TimelineAnimationControl';
import { TimelineSettingsControl } from './TimelineSettingsControl';
import { TimelineTrackContainer } from './TimelineTrackContainer';
import { TimelineTrack } from './TimelineTrack';
import { TimelineTicks } from './TimelineTicks';
import { TimelineTick } from './TimelineTick';
import { TimelineTickDateText } from './TimelineTickDateText';
import { TimelineTimeText } from './TimelineTimeText';
import { TimelineDateText } from './TimelineDateText';
import { TimelineScrubber } from './TimelineScrubber';
import { TimelineTimeProgressIndicator } from './TimelineTimeProgressIndicator';
import { TimelineLineProgressIndicator } from './TimelineLineProgressIndicator';
import { TimelineResizeHandler } from './TimelineResizeHandler';
import { TimelineMoveToStart } from './TimelineMoveToStart';
import { TimelineMoveToEnd } from './TimelineMoveToEnd';
import { TimelineMoveToNow } from './TimelineMoveToNow';

interface TimelineRootProps extends TimelineProviderProps {
    children: React.ReactNode;
}
const TimelineRoot = ({ children, ...rest }: TimelineRootProps) => (
    <TimelineProvider {...rest}>
        {children}
    </TimelineProvider>
);
TimelineRoot.displayName = 'Timeline.Root';

type TimelineProps = TimelineRootProps;

const Timeline = ({ children, ...rest }: TimelineProps) => (
    <Timeline.Root {...rest}>
        {children}
    </Timeline.Root>
);
Timeline.displayName = 'Timeline';

const TimelineCenteredIndicator = CenterXPositioner;
TimelineCenteredIndicator.displayName = 'Timeline.CenteredIndicator';

Timeline.Root = TimelineRoot;
Timeline.Provider = TimelineProvider;
Timeline.Container = TimelineContainer;
Timeline.AnimationControl = TimelineAnimationControl;
Timeline.SettingsControl = TimelineSettingsControl;
Timeline.TrackContainer = TimelineTrackContainer;
Timeline.Track = TimelineTrack;
Timeline.Ticks = TimelineTicks;
Timeline.Tick = TimelineTick;
Timeline.TickDateText = TimelineTickDateText;
Timeline.TimeText = TimelineTimeText;
Timeline.DateText = TimelineDateText;
Timeline.Scrubber = TimelineScrubber;
Timeline.CenteredIndicator = TimelineCenteredIndicator;
Timeline.TimeProgressIndicator = TimelineTimeProgressIndicator;
Timeline.LineProgressIndicator = TimelineLineProgressIndicator;
Timeline.ResizeHandler = TimelineResizeHandler;
Timeline.MoveToStart = TimelineMoveToStart;
Timeline.MoveToEnd = TimelineMoveToEnd;
Timeline.MoveToNow = TimelineMoveToNow;

/* ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
// Compound Component
export { Timeline, type TimelineProps };

// Context
export { TimelineContext, useTimelineContext, type TimelineContextProps } from '@/providers/TimelineProvider';

// Sub-components
export { TimelineRoot, type TimelineRootProps };
export { TimelineProvider, type TimelineProviderProps } from '@/providers/TimelineProvider';
export { TimelineContainer, type TimelineContainerProps } from './TimelineContainer';
export { TimelineAnimationControl, type TimelineAnimationControlProps } from './TimelineAnimationControl';
export { TimelineSettingsControl, type TimelineSettingsControlProps } from './TimelineSettingsControl';
export { TimelineTrackContainer, type TimelineTrackContainerProps } from './TimelineTrackContainer';
export { TimelineTrack, type TimelineTrackProps } from './TimelineTrack';
export { TimelineTicks, type TimelineTicksProps } from './TimelineTicks';
export { TimelineTick, type TimelineTickProps } from './TimelineTick';
export { TimelineTickDateText, type TimelineTickDateTextProps } from './TimelineTickDateText';
export { TimelineTimeText, type TimelineTimeTextProps } from './TimelineTimeText';
export { TimelineDateText, type TimelineDateTextProps } from './TimelineDateText';
export { TimelineScrubber, type TimelineScrubberProps } from './TimelineScrubber';
export {
    CenterXPositioner as TimelineCenteredIndicator,
    type CenterXPositionerProps as TimelineCenteredIndicatorProps
} from '@/components/primitives/layout/CenterXPositioner';
export {
    TimelineTimeProgressIndicator,
    type TimelineTimeProgressIndicatorProps
} from './TimelineTimeProgressIndicator';
export { TimelineLineProgressIndicator } from './TimelineLineProgressIndicator';
export { TimelineResizeHandler, type TimelineResizeHandlerProps } from './TimelineResizeHandler';
export { TimelineMoveToStart, type TimelineMoveToStartProps } from './TimelineMoveToStart';
export { TimelineMoveToEnd, type TimelineMoveToEndProps } from './TimelineMoveToEnd';
export { TimelineMoveToNow, type TimelineMoveToNowProps } from './TimelineMoveToNow';

// Hooks
export { useTicks, type UseTicksProps } from './useTicks';
/* ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
