import { ReactNode, ComponentType } from 'react';
import clsx from 'clsx';
import { useLocationContext } from '@/providers/LocationProvider';
import { WeatherApiDataFetcher } from '@/components/data/api/WeatherApiDataFetcher';
import { IconButton } from '@/components/primitives/buttons/IconButton';
import { DATA_VIEW_CONFIG } from '@/constants/forecast';
import { DataView } from '@/types/forecast';
import { HStack } from '@/components/primitives/layout/Stack';
import { IconProps } from '@/components/primitives/display/Icon';
import { TemperatureIcon, WindIcon, UmbrellaIcon, SnowIcon } from '@/components/compositions/icons/Icon';
import * as Tooltip from '@radix-ui/react-tooltip';
import { OutlookView } from '../OutlookView';

export interface ForecastBaseViewProps {
    dataView: DataView;
    controlSlot: ReactNode;
    children: ReactNode;
    setDataView: (data: DataView) => void
}

const DATA_VIEW_BUTTON_CONFIGS = [{
    id: DATA_VIEW_CONFIG.temperature.id,
    Icon: TemperatureIcon,
    label: 'Temperature'
}, {
    id: DATA_VIEW_CONFIG.wind.id,
    Icon: WindIcon,
    label: 'Wind'
}, {
    id: DATA_VIEW_CONFIG.precipitation.id,
    Icon: UmbrellaIcon,
    label: 'Precipitation'
}, {
    id: DATA_VIEW_CONFIG.snowfall.id,
    Icon: SnowIcon,
    label: 'Snowfall'
}];

export const ForecastBaseView = ({
    children,
    controlSlot,
    dataView,
    setDataView
}: ForecastBaseViewProps) => {
    const { coordinatesString } = useLocationContext();

    const getDataViewIconProps = (id: DataView, Icon: ComponentType<IconProps>) => {
        const selected = dataView === id;
        return {
            className: clsx(
                'xw-flex xw-justify-center xw-items-center xw-w-8 xw-h-8 xw-rounded-full',
                selected ? 'xw-bg-slate-900' : 'xw-bg-slate-100 xw-text-slate-900'
            ),
            iconProps: {
                color: selected
                    ? 'white'
                    : '#212121',
                size: id === 'temperature' || id === 'precipitation'
                    ? 20
                    : 18
            },
            icon: Icon,
            onClick: () => setDataView(id)
        };
    };

    return (
        <div className="xw-mt-3">
            <WeatherApiDataFetcher
                endpoint="phrases/summary"
                params={{
                    p: coordinatesString
                }}
            >
                <OutlookView className="xw-mb-5" />
            </WeatherApiDataFetcher>
            <HStack className="xw-py-2">
                {controlSlot}
                <HStack className="xw-ml-auto xw-gap-1">
                    {DATA_VIEW_BUTTON_CONFIGS.map(({ id, Icon, label }) => (
                        <Tooltip.Provider key={id} delayDuration={0}>
                            <Tooltip.Root>
                                <Tooltip.Trigger asChild>
                                    <IconButton {...getDataViewIconProps(id, Icon)} />
                                </Tooltip.Trigger>
                                <Tooltip.Content
                                    className="xw-text-white xw-rounded-full xw-py-1.5 xw-px-3 xw-text-xs xw-bg-black"
                                    sideOffset={8}
                                    side="top"
                                >
                                    {label}
                                </Tooltip.Content>
                            </Tooltip.Root>
                        </Tooltip.Provider>
                    ))}
                </HStack>
            </HStack>
            {children}
        </div>
    );
};
