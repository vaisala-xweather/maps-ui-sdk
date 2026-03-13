import { ComponentType, ReactNode } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import clsx from 'clsx';
import { IconButton } from '@/components/primitives/buttons/IconButton';
import { HStack } from '@/components/primitives/layout/Stack';
import { IconProps } from '@/components/primitives/display/Icon';
import { Slot } from '@/components/primitives/utils/Slot';
import {
    TemperatureIcon,
    WindIcon,
    UmbrellaIcon,
    SnowIcon
} from '@/components/compositions/icons/Icon';
import { ForecastDataView } from '@/types/forecast';
import { Option } from '@/types/control';
import { useForecastMetrics } from './ForecastProvider';

interface MetricUiConfig {
    Icon: ComponentType<IconProps>;
}

const METRIC_UI_CONFIG: Record<ForecastDataView, MetricUiConfig> = {
    temperature: {
        Icon: TemperatureIcon
    },
    wind: {
        Icon: WindIcon
    },
    precipitation: {
        Icon: UmbrellaIcon
    },
    snowfall: {
        Icon: SnowIcon
    }
};

export interface ForecastMetricSelectorRenderProps {
    value: ForecastDataView;
    options: Option[];
    onValueChange: (value: ForecastDataView) => void;
    className?: string;
}

export interface ForecastMetricSelectorProps {
    className?: string;
    asChild?: boolean;
    children?: ReactNode | ((props: ForecastMetricSelectorRenderProps) => ReactNode);
}

const getMetricIconProps = (id: ForecastDataView, selectedMetric: ForecastDataView) => {
    const selected = selectedMetric === id;
    return {
        className: clsx(
            'xw-flex xw-justify-center xw-items-center xw-w-8 xw-h-8 xw-rounded-full',
            selected ? 'xw-bg-slate-900' : 'xw-bg-slate-100 xw-text-slate-900'
        ),
        iconProps: {
            color: selected ? 'white' : '#212121',
            size: id === 'temperature' || id === 'precipitation' ? 20 : 18
        }
    };
};

export const ForecastMetricSelector = ({
    className,
    asChild = false,
    children
}: ForecastMetricSelectorProps) => {
    const { dataView, setDataView, metricOptions } = useForecastMetrics();

    const renderProps: ForecastMetricSelectorRenderProps = {
        value: dataView,
        options: metricOptions,
        onValueChange: setDataView,
        className
    };

    if (typeof children === 'function') {
        return children(renderProps);
    }

    if (asChild) {
        return children
            ? <Slot {...renderProps}>{children}</Slot>
            : null;
    }

    return (
        <Tooltip.Provider delayDuration={0}>
            <HStack className={className ?? 'xw-gap-1'}>
                {metricOptions.map((metricOption) => {
                    const id = metricOption.value as ForecastDataView;
                    const metricConfig = METRIC_UI_CONFIG[id];

                    if (!metricConfig) {
                        return null;
                    }

                    const { Icon } = metricConfig;
                    const label = metricOption.label || id;

                    return (
                        <Tooltip.Root key={id}>
                            <Tooltip.Trigger asChild>
                                <IconButton
                                    {...getMetricIconProps(id, dataView)}
                                    icon={Icon}
                                    aria-label={label}
                                    aria-pressed={dataView === id}
                                    onClick={() => setDataView(id)}
                                />
                            </Tooltip.Trigger>
                            <Tooltip.Content
                                className="xw-text-white xw-rounded-full xw-py-1.5 xw-px-3 xw-text-xs xw-bg-black"
                                sideOffset={8}
                                side="top"
                            >
                                {label}
                            </Tooltip.Content>
                        </Tooltip.Root>
                    );
                })}
            </HStack>
        </Tooltip.Provider>
    );
};

ForecastMetricSelector.displayName = 'Forecast.MetricSelector';
