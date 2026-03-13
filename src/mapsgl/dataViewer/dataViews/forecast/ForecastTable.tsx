import { ComponentType, Fragment, ReactNode } from 'react';
import { ForecastDataView, ForecastPeriod, ForecastRowSlots, ForecastValueRenderProps } from '@/types/forecast';
import { DateDisplay } from '@/components/primitives/display/dateDisplay';
import { PanelList } from '@/components/primitives/layout/panel/PanelList';
import { Hr } from '@/components/primitives/layout/Hr';
import { HStack, VStack } from '@/components/primitives/layout/Stack';
import { isWindView } from '@/utils/forecast';
import { isPrecipitationOrSnowfall } from '@/utils/units';
import { ColorRange } from '@/components/compositions/colorRange';
import { ForecastUnitBanner } from './ForecastUnitBanner';
import { ForecastWeatherIcon } from './ForecastWeatherIcon';
import { ForecastSunriseSunsetBar } from './ForecastSunriseSunsetBar';
import { ForecastPrecipChance } from './ForecastPrecipChance';
import { useForecastDomainData } from './useForecastDomainData';
import { useForecastColorRange } from './useForecastColorRange';

const defaultListClassName = 'xw-overflow-x-hidden';
const defaultListDividerClassName = 'xw-border-slate-200';

function defaultRenderValue(props: ForecastValueRenderProps): ReactNode {
    const { dataView, valueMode, measurementType, colorRangeProps } = props;

    if (valueMode === 'range') {
        return (
            <ColorRange {...colorRangeProps}>
                {
                    isPrecipitationOrSnowfall(measurementType)
                        ? (
                            <ColorRange.Bar
                                maxSlot={
                                    <>
                                        <ColorRange.Circle size={[16, 10]} />
                                        <ColorRange.Label>
                                            {colorRangeProps.max === 0 ? '' : colorRangeProps.max}
                                        </ColorRange.Label>
                                    </>
                                }
                            />
                        )
                        : (
                            <ColorRange.Offset>
                                <ColorRange.Gradient
                                    minSlot={
                                        <>
                                            <ColorRange.Label />
                                            <ColorRange.Circle size={[16, 10]} />
                                        </>
                                    }
                                    maxSlot={
                                        <>
                                            <ColorRange.Circle size={[16, 10]} />
                                            <ColorRange.Label />
                                        </>
                                    }
                                />
                            </ColorRange.Offset>
                        )
                }
            </ColorRange>
        );
    }

    const expectedValue = colorRangeProps.max ?? 0;
    return (
        <ColorRange {...colorRangeProps}>
            <ColorRange.Bar
                maxSlot={
                    <>
                        <ColorRange.Circle size={[24, 16]} />
                        <ColorRange.Label>
                            {
                                isWindView(dataView) && expectedValue === 0
                                    ? 'Calm'
                                    : ((isPrecipitationOrSnowfall(measurementType) && expectedValue === 0)
                                        ? ''
                                        : expectedValue)
                            }
                        </ColorRange.Label>
                    </>
                }
            />
        </ColorRange>
    );
}

export interface ForecastTableProps {
    intervalId?: string;
    dataView?: ForecastDataView;
    renderIcon?: ForecastRowSlots['renderIcon'];
    renderSunriseSunset?: ForecastRowSlots['renderSunriseSunset'];
    renderPrecipChance?: ForecastRowSlots['renderPrecipChance'];
    renderHeader?: ForecastRowSlots['renderHeader'];
    renderValue?: ForecastRowSlots['renderValue'];
    renderRow?: ForecastRowSlots['renderRow'];
    /**
     * When provided, renders the row nodes with a custom container instead of the default PanelList.
     * For semantic containers such as `<ul>` or `<table>`, use `renderRow` to return matching child elements.
     */
    renderContainer?: (children: ReactNode[]) => ReactNode;
}

export const ForecastTable = ({
    intervalId,
    dataView,
    renderIcon,
    renderSunriseSunset,
    renderPrecipChance,
    renderHeader,
    renderValue,
    renderRow,
    renderContainer
}: ForecastTableProps) => {
    const domainData = useForecastDomainData({ intervalId, dataView });
    const colorRangeData = useForecastColorRange(domainData);

    if (!domainData || !colorRangeData) {
        return null;
    }

    const {
        periods,
        dataView: resolvedDataView,
        valueMode,
        dateDisplayComponent: DateDisplayComponent,
        measurementType
    } = domainData;

    const { getColorRangeProps } = colorRangeData;

    const renderValueCell = (period: ForecastPeriod, index: number) => {
        if (renderValue === null) return null;
        const valueProps: ForecastValueRenderProps = {
            period,
            index,
            dataView: resolvedDataView,
            valueMode,
            measurementType,
            colorRangeProps: getColorRangeProps(period)
        };
        return renderValue ? renderValue(valueProps) : defaultRenderValue(valueProps);
    };

    const headerContent = renderHeader === null
        ? null
        : (renderHeader ? renderHeader(resolvedDataView) : <ForecastUnitBanner dataView={resolvedDataView} />);

    const rowNodes = periods?.map((period: ForecastPeriod, index: number) => {
        const defaultIcon = <ForecastWeatherIcon period={period} />;
        const defaultSunriseSunset = (period?.sunriseDateFormatted || period?.sunsetDateFormatted)
            ? <ForecastSunriseSunsetBar period={period} />
            : null;
        const defaultPrecipChance = <ForecastPrecipChance percent={period.pop} />;
        const colorRangeNode = renderValueCell(period, index);

        if (renderRow) {
            const defaultDateDisplay = period?.dateTimeISO ? (
                <DateDisplay value={period.dateTimeISO}>
                    <VStack className="xw-w-10 xw-min-w-10 xw-max-w-10 xw-whitespace-nowrap xw-mr-1">
                        <DateDisplay.DayShort />
                        <DateDisplayComponent />
                    </VStack>
                </DateDisplay>
            ) : null;

            return (
                <Fragment key={`${period?.dateTimeISO ?? 'period'}-${index}`}>
                    {renderRow({
                        period,
                        index,
                        dateDisplayComponent: DateDisplayComponent as ComponentType<Record<string, unknown>>,
                        colorRange: colorRangeNode,
                        defaults: {
                            icon: defaultIcon,
                            sunriseSunset: defaultSunriseSunset,
                            precipChance: defaultPrecipChance,
                            dateDisplay: defaultDateDisplay
                        }
                    })}
                </Fragment>
            );
        }

        const sunriseSunsetContent = renderSunriseSunset === null
            ? null
            : (renderSunriseSunset ? renderSunriseSunset(period) : defaultSunriseSunset);
        const iconContent = renderIcon === null
            ? null
            : (renderIcon ? renderIcon(period) : defaultIcon);
        const precipChanceContent = renderPrecipChance === null
            ? null
            : (renderPrecipChance ? renderPrecipChance(period) : defaultPrecipChance);

        return (
            <Fragment key={`${period?.dateTimeISO ?? 'period'}-${index}`}>
                {sunriseSunsetContent && (
                    <>
                        {sunriseSunsetContent}
                        <Hr className="xw-border-slate-200" />
                    </>
                )}
                <HStack className="xw-py-2.5 xw-h-14 xw-items-center xw-gap-1">
                    {period?.dateTimeISO && (
                        <DateDisplay value={period?.dateTimeISO}>
                            <VStack className="xw-w-10 xw-min-w-10 xw-max-w-10 xw-whitespace-nowrap xw-mr-1">
                                <DateDisplay.DayShort />
                                <DateDisplayComponent />
                            </VStack>
                        </DateDisplay>
                    )}
                    {iconContent}
                    {precipChanceContent}
                    <div className="xw-relative xw-w-full">
                        {colorRangeNode}
                    </div>
                </HStack>
            </Fragment>
        );
    }) ?? [];

    const listContent = renderContainer
        ? renderContainer(rowNodes)
        : (
            <PanelList
                className={defaultListClassName}
                dividerClassName={defaultListDividerClassName}
                showLastDivider
            >
                {rowNodes}
            </PanelList>
        );

    return (
        <>
            {headerContent}
            {listContent}
        </>
    );
};

ForecastTable.displayName = 'Forecast.Table';
