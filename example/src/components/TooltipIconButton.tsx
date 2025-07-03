import { ComponentType, useMemo } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import {
    type IconProps,
    useResponsive,
    resolveResponsiveProperty
} from '@xweather/maps-ui-sdk';
import { type Responsive } from '@xweather/maps-ui-sdk/types/responsive';
import { type Side } from '@xweather/maps-ui-sdk/types/position';
import { IconButton } from './IconButton';

const TOOLTIP_STYLES = {
    content: 'text-white rounded-full py-1.5 px-3 text-xs bg-black z-[100]'
} as const;

export interface TooltipIconButtonProps {
  /** Icon component to render */
  icon: ComponentType<IconProps>
  /** Tooltip text content */
  label: string
  /** Size variant - determines button dimensions */
  size?: 'sm' | 'md'
  /** Whether the button is in an active state */
  isActive?: boolean
  /** Responsive tooltip positioning */
  tooltipSide?: Responsive<Side>
  /** Click handler */
  onClick: () => void
}

export const TooltipIconButton = ({
    icon,
    label,
    onClick,
    size = 'md',
    isActive = false,
    tooltipSide = { base: 'bottom', sm: 'right' }
}: TooltipIconButtonProps) => {
    const { breakpoint } = useResponsive();

    const resolvedTooltipSide = useMemo(
        () => resolveResponsiveProperty(tooltipSide, breakpoint) ?? 'right',
        [tooltipSide, breakpoint]
    );

    return (
        <Tooltip.Root>
            <Tooltip.Trigger asChild>
                <IconButton
                    icon={icon}
                    onClick={onClick}
                    size={size}
                    isActive={isActive}
                />
            </Tooltip.Trigger>

            <Tooltip.Content
                className={TOOLTIP_STYLES.content}
                side={resolvedTooltipSide}
                sideOffset={16}
            >
                {label}
            </Tooltip.Content>
        </Tooltip.Root>
    );
};

IconButton.displayName = 'IconButton';
