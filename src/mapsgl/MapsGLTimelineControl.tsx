import { useState, useEffect, useRef, MutableRefObject, ReactNode, RefObject } from 'react';
import clsx from 'clsx';
import { AnimatePresence } from 'framer-motion';
import { TimelineSettingsConfig } from '@/types/timeline';
import { ExpandCollapseProvider, ExpandCollapseContext } from '@/providers/ExpandCollapseProvider';
import { Timeline, TimelineContext } from '@/components/compositions/timeline';
import { EXPAND_COLLAPSE_ANIMATION_STATES } from '@/constants/animation';
import { useLoadingContext } from '@/providers/LoadingProvider';
import { Popover } from '@/components/primitives/overlays/popover';
import { THEME } from '@/constants/theme';
import { BREAKPOINTS } from '@/constants/responsive';
import { useResponsive } from '@/hooks/useResponsive';
import { IconButton } from '@/components/primitives/buttons/IconButton';
import { usePositionContext } from '@/providers/PositionProvider';
import { ModalContextType, useModalContext } from '@/components/primitives/overlays/modal';
import * as Tooltip from '@radix-ui/react-tooltip';
import { ExpandCollapseHorizontal } from '@/components/primitives/animation/ExpandCollapseHorizontal';
import { FadePresence, Fade } from '@/components/primitives/animation/Fade';
import { LoadingSpinner } from '@/components/primitives/animation/LoadingSpinner';
import { PreferencesFillPartialIcon, ExpandIcon, CollapseIcon } from '@/components/compositions/icons/Icon';
import { HStack, VStack } from '@/components/primitives/layout/Stack';
import { useMapsGLMapControllerContext } from './MapsGLMapControllerProvider';

const {
    expanded,
    collapsed,
    collapseInitiationComplete,
    expandInitiationComplete
} = EXPAND_COLLAPSE_ANIMATION_STATES;

export interface TooltipButtonProps {
    children: ReactNode;
    tooltipText: string;
    relativeToRef?: RefObject<HTMLElement>;
    offset?: number;
}

export const TooltipButton = ({
    children,
    tooltipText,
    offset = 16,
    relativeToRef
}: TooltipButtonProps) => (
    <Tooltip.Provider delayDuration={0}>
        <Tooltip.Root>
            <Tooltip.Trigger asChild>
                {children}
            </Tooltip.Trigger>
            <Tooltip.Content
                className="xw-text-white xw-rounded-full xw-py-1.5 xw-px-3 xw-text-xs xw-bg-black xw-z-[100]"
                sideOffset={offset}
                {...(relativeToRef && { container: relativeToRef.current })}
            >
                {tooltipText}
            </Tooltip.Content>
        </Tooltip.Root>
    </Tooltip.Provider>
);

export interface TimelineTrackProps {
    isResizing?: boolean;
}

export const ExpandedTimelineTrack = ({ isResizing }: TimelineTrackProps) => {
    const moveToNowButtonRef = useRef<HTMLButtonElement>(null);

    return (
        <Fade
            className="xw-flex xw-w-full xw-h-full"
            animate={isResizing ? 'hidden' : 'visible'}
            duration={0.1}
        >
            <Timeline.Track className="xw-items-end xw-text-white xw-text-xs xw-mt-1">
                <Timeline.Scrubber>
                    <Timeline.TimeProgressIndicator />
                </Timeline.Scrubber>
                <TooltipButton
                    tooltipText="Go to now"
                    relativeToRef={moveToNowButtonRef}
                    offset={26}
                >
                    <Timeline.MoveToNow className="xw-top-8" ref={moveToNowButtonRef}>
                        <div className="xw-absolute xw-bg-secondary-200 xw-w-0.5 xw-h-7 xw-bottom-1" />
                    </Timeline.MoveToNow>
                </TooltipButton>
                <Timeline.Ticks>
                    {(tick) => (
                        <>
                            <Timeline.Tick
                                tick={tick}
                                className="xw-bg-white xw-h-2 xw-w-px"
                            />
                            <Timeline.TickDateText
                                tick={tick}
                                className="xw-text-white xw-text-xs"
                            />
                        </>
                    )}
                </Timeline.Ticks>
            </Timeline.Track>
        </Fade>
    );
};

export interface ExpandedTimelineViewProps {
    isResizing: boolean;
    onAnimationComplete: () => void;
}

export const ExpandedTimelineView = ({ onAnimationComplete, isResizing }: ExpandedTimelineViewProps) => (
    <Fade
        duration={0.2}
        key="expanded"
        className="xw-flex xw-items-center xw-w-full xw-h-full"
        onAnimationComplete={onAnimationComplete}
    >
        <TooltipButton tooltipText="Go to start">
            <Timeline.MoveToStart
                className="xw-border-white xw-min-w-6.5 xw-border-r-3" />
        </TooltipButton>

        <Timeline.ResizeHandler>
            <ExpandedTimelineTrack isResizing={isResizing} />
        </Timeline.ResizeHandler>

        <TooltipButton tooltipText="Go to end">
            <Timeline.MoveToEnd
                className="xw-border-white xw-min-w-6.5 xw-border-l-3" />
        </TooltipButton>
    </Fade>
);

export const CollapsedTimelineTrack = () => {
    const moveToNowButtonRef = useRef<HTMLButtonElement>(null);
    return (
        <Timeline.Track className="xw-h-5 xw-border xw-border-slate-800 xw-bg-slate-900 xw-rounded-full xw-mt-auto">
            <Timeline.Scrubber className="xw-cursor-pointer xw-py-3 -xw-my-3 xw-px-2 -xw-mx-2">
                <Timeline.LineProgressIndicator />

            </Timeline.Scrubber>
            <TooltipButton
                tooltipText="Go to now"
                relativeToRef={moveToNowButtonRef}
                offset={20}
            >
                <Timeline.MoveToNow
                    className="xw-top-[13px] xw-cursor-pointer xw-p-3 -xw-my-3"
                    ref={moveToNowButtonRef}>
                    <div className="xw-absolute xw-bg-secondary-200 xw-w-0.5 xw-h-4 xw-bottom-4" />
                </Timeline.MoveToNow>
            </TooltipButton>
        </Timeline.Track>
    );
};

export interface CollapsedTimelineViewProps {
    onAnimationComplete: () => void;
}

export const CollapsedTimelineView = ({ onAnimationComplete }: CollapsedTimelineViewProps) => (
    <Fade
        duration={0.2}
        key="collapsed"
        className="xw-w-full xw-h-full"
        onAnimationComplete={onAnimationComplete}
    >
        <VStack className="xw-items-center xw-h-full">
            <HStack className="xw-justify-start xw-w-full xw-space-x-1 xw-text-xs xw-text-white">
                <Timeline.DateText />,
                <Timeline.TimeText className="xw-lowercase" />
            </HStack>
            <CollapsedTimelineTrack />
        </VStack>
    </Fade>
);

export interface TimelineSettingsPopoverProps {
    children: ReactNode;
    relativeToRef: RefObject<HTMLElement>;
    isVisible: boolean;
    onVisibilityChange: (isVisible: boolean) => void;
}

export const TimelineSettingsPopover = ({
    children,
    relativeToRef,
    isVisible,
    onVisibilityChange
}: TimelineSettingsPopoverProps) => (
    <Popover>
        <Popover.Position
            relativeToRef={relativeToRef}
            side="top"
            align="start"
            offsetY={-8}>
            <Popover.Trigger
                onClick={() => onVisibilityChange(!isVisible)}
                className="xw-text-white xw-flex xw-flex-shrink-0 xw-items-center
                    xw-justify-center xw-w-7 xw-h-7 xw-mr-2 sm:xw-mr-3">
                <PreferencesFillPartialIcon size={16} />
            </Popover.Trigger>
            <FadePresence isPresent={isVisible}>
                <Popover.Content
                    isVisibleOverride={isVisible}
                    className="xw-shadow-md xw-bg-white xw-p-4 xw-rounded-lg
                    xw-text-slate-900 xw-w-[300px] xw-z-100">
                    <Popover.Close
                        onClick={() => onVisibilityChange(false)}
                        className="xw-absolute xw-right-3 xw-bg-slate-200
                        xw-flex xw-items-center xw-justify-center xw-w-7 xw-h-7 xw-rounded-full"
                        iconProps={{ size: 10, color: THEME.colors['slate-500'] }} />
                    <Popover.Arrow />
                    <Popover.Title>Timeline</Popover.Title>
                    {children}
                </Popover.Content>
            </FadePresence>
        </Popover.Position>
    </Popover>
);

export interface MapsGLTimelineControlProps {
    className?: string;
    defaultExpanded?: boolean;
}

export const MapsGLTimelineControl = ({ className, defaultExpanded }: MapsGLTimelineControlProps) => {
    const { offsetX } = usePositionContext();
    const { controller } = useMapsGLMapControllerContext();
    const { modalData }: ModalContextType = useModalContext();
    const [showTimelineSettings, setShowTimelineSettings] = useState(false);
    const [currentDate, setCurrentDate] = useState<Date | null>(controller?.timeline?.currentDate);
    const { breakpoint } = useResponsive(0);
    const timelineContainerRef = useRef<HTMLDivElement>(null);
    const { loading } = useLoadingContext();
    const collapsedWidth = window.innerWidth < (512 + (offsetX * 2 || 0)) ? '100%' : '512px';

    const [timelineSettingsConfig, setTimelineSettingsConfig] = useState<TimelineSettingsConfig>({
        speeds: [0.25, 0.5, 1, 2].map((timeScale) => ({
            value: timeScale,
            label: `${timeScale}x`,
            selected: timeScale === controller.timeline.timeScale
        }))
    });

    useEffect(() => {
        if (modalData?.id === 'data-viewer') {
            setShowTimelineSettings(false);
        }
        /* eslint-disable react-hooks/exhaustive-deps */
    }, [modalData]);

    useEffect(() => {
        if (currentDate) {
            controller?.timeline?.goToDate(currentDate);
        }
        controller?.timeline.on('advance', () => {
            if (controller?.timeline?.currentDate) {
                setCurrentDate(controller?.timeline?.currentDate);
            }
        });
    }, []);

    const handlePlay = () => {
        if (controller?.timeline.isActive) {
            controller.timeline.resume();
        } else {
            controller?.timeline.play();
        }
    };

    const handlePause = () => {
        controller?.timeline.pause();
    };

    const handlePositionChange = (position: number) => {
        controller?.timeline.goTo(position);
    };

    const handleStartDateChange = (newStartDate: Date) => {
        controller.timeline.startDate = newStartDate;
        if (currentDate) {
            controller.timeline.goToDate(currentDate);
        }
    };

    const handleEndDateChange = (newEndDate: Date) => {
        controller.timeline.endDate = newEndDate;
        if (currentDate) {
            controller.timeline.goToDate(currentDate);
        }
    };

    const handleSpeedChange = (newSpeed: number) => {
        controller.timeline.timeScale = newSpeed;

        setTimelineSettingsConfig((prev) => ({
            ...prev,
            speeds: prev.speeds.map((speed) => ({
                ...speed,
                selected: speed.value === newSpeed
            }))
        }));
    };

    if (!controller?.timeline) return null;

    return (
        <Timeline
            startDate={controller?.timeline.startDate}
            endDate={controller?.timeline.endDate}
            currentDate={currentDate ?? controller?.timeline.startDate}
            position={controller.timeline.position}
            onPlay={handlePlay}
            onPause={handlePause}
            onPositionChange={handlePositionChange}
        >
            <ExpandCollapseProvider
                initialState={defaultExpanded === undefined
                    ? (breakpoint === BREAKPOINTS.base.className ? collapsed : expanded)
                    : (defaultExpanded ? expanded : collapsed)}
            >
                <ExpandCollapseContext.Consumer>
                    {({ setAnimationState, toggle, isCollapsed, isExpanded, isExpanding }) => {
                        const applyExpandStyles = isExpanded || isExpanding;

                        return (
                            <ExpandCollapseHorizontal
                                expanded={isExpanded || isExpanding}
                                collapsedWidth={collapsedWidth}
                            >
                                <Timeline.Container
                                    ref={timelineContainerRef}
                                    className={clsx(
                                        'xw-rounded-xl xw-z-30 xw-bg-black',
                                        applyExpandStyles ? 'xw-h-16 xw-p-3' : 'xw-h-14 xw-p-2',
                                        className
                                    )}
                                >
                                    <Timeline.AnimationControl
                                        className={clsx(
                                            'xw-bg-white xw-rounded-full xw-mr-2 sm:xw-mr-3',
                                            applyExpandStyles
                                                ? 'xw-h-10 xw-w-10 xw-min-h-10 xw-min-w-10'
                                                : 'xw-h-8 xw-w-8 xw-min-h-8 xw-min-w-8'
                                        )}
                                    />
                                    {loading && <LoadingSpinner
                                        size={applyExpandStyles ? 58 : 46}
                                        className={clsx(
                                            'xw-absolute',
                                            applyExpandStyles ? 'xw-left-[3px]' : 'xw-left-[1px]'
                                        )}
                                    />}

                                    <TimelineSettingsPopover
                                        relativeToRef={timelineContainerRef}
                                        isVisible={showTimelineSettings}
                                        onVisibilityChange={setShowTimelineSettings}
                                    >
                                        <Timeline.SettingsControl
                                            config={timelineSettingsConfig}
                                            onStartDateChange={handleStartDateChange}
                                            onEndDateChange={handleEndDateChange}
                                            onSpeedChange={handleSpeedChange}
                                        />
                                    </TimelineSettingsPopover>
                                    <div className="xw-mr-auto"></div>
                                    <TimelineContext.Consumer>
                                        {({ isResizing }) => (
                                            <AnimatePresence mode="wait">
                                                {isExpanded && breakpoint !== BREAKPOINTS.base.className && (
                                                    <ExpandedTimelineView
                                                        isResizing={isResizing}
                                                        onAnimationComplete={() => {
                                                            setAnimationState(collapseInitiationComplete);
                                                        }} />
                                                )}

                                                {(isCollapsed || breakpoint === BREAKPOINTS.base.className) && (
                                                    <CollapsedTimelineView
                                                        onAnimationComplete={() => {
                                                            setAnimationState(expandInitiationComplete);
                                                        }} />
                                                )}
                                            </AnimatePresence>
                                        )}
                                    </TimelineContext.Consumer>
                                    <FadePresence
                                        isPresent={breakpoint !== BREAKPOINTS.base.className}
                                        duration={0.2}>
                                        <IconButton
                                            id="timeline-expand-collapse-button"
                                            className={clsx(
                                                'xw-ml-2 sm:xw-ml-3 xw-bg-slate-800 xw-text-white xw-rounded-full',
                                                applyExpandStyles
                                                    ? 'xw-h-10 xw-w-10 xw-min-h-10 xw-min-w-10'
                                                    : 'xw-h-8 xw-w-8 xw-min-h-8 xw-min-w-8'
                                            )}
                                            onClick={toggle}
                                            icon={applyExpandStyles ? CollapseIcon : ExpandIcon}
                                            iconProps={{ size: applyExpandStyles ? 18 : 16 }} />
                                    </FadePresence>
                                </Timeline.Container>

                            </ExpandCollapseHorizontal>
                        );
                    }}
                </ExpandCollapseContext.Consumer>
            </ExpandCollapseProvider>
        </Timeline>
    );
};
