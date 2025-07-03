import clsx from 'clsx';
import { useTimelineContext } from '@/providers/TimelineProvider';
import { IconButton } from '@/components/primitives/buttons/IconButton';
import { PauseIcon, PlayIcon } from '@/components/compositions/icons/Icon';

export interface TimelineAnimationControlProps {
    className?: string;
}

export const TimelineAnimationControl = ({
    className = ''
}: TimelineAnimationControlProps) => {
    const { isPlaying, onAnimationControlClick } = useTimelineContext();

    return (
        <IconButton
            id="timeline-control-button"
            className={clsx(
                'xw-timeline-animation-control',
                className
            )}
            onClick={onAnimationControlClick}
            icon={isPlaying ? PauseIcon : PlayIcon}
            iconProps={{ className: isPlaying ? '' : 'xw-ml-0.5' }}
        />
    );
};

TimelineAnimationControl.displayName = 'Timeline.AnimationControl';
