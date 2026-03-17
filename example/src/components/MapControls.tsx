import { ComponentType } from 'react';
import { type IconProps, useMapsGLMapControllerContext } from '@xweather/maps-ui-sdk';
import {
    AddIcon,
    SubtractIcon,
    LegendIcon,
    TargetIcon,
    GeoLocateIcon,
    GlobeIcon
} from './Icons';
import { Box } from './Box';
import { useMapContext } from '../providers/MapProvider';
import { TooltipIconButton } from './TooltipIconButton';

interface MapControlConfig {
    id: string;
    icon: ComponentType<IconProps>;
    tooltip: string;
    onClick: () => void;
    isActive?: boolean;
}

export const MapControls = () => {
    const { currentProjection, geoLocate, toggleProjection } = useMapContext();
    const {
        controller,
        isLegendVisible,
        isDataInspectorVisible,
        toggleLegend,
        toggleDataInspector
    } = useMapsGLMapControllerContext();

    const controlsConfig: MapControlConfig[] = [{
        id: 'zoom-in',
        icon: AddIcon,
        tooltip: 'Zoom In',
        onClick: () => controller?.map.zoomIn()
    }, {
        id: 'zoom-out',
        icon: SubtractIcon,
        tooltip: 'Zoom Out',
        onClick: () => controller?.map.zoomOut()
    }, {
        id: 'legend',
        icon: LegendIcon,
        tooltip: 'Toggle Legend',
        isActive: isLegendVisible,
        onClick: toggleLegend
    }, {
        id: 'data-inspector',
        icon: TargetIcon,
        tooltip: 'Toggle Data Inspector',
        isActive: isDataInspectorVisible,
        onClick: () => toggleDataInspector('move', true)
    }, {
        id: 'projection',
        icon: GlobeIcon,
        tooltip: currentProjection === 'globe' ? 'Switch to Mercator' : 'Switch to Globe',
        isActive: currentProjection === 'globe',
        onClick: toggleProjection
    }, {
        id: 'geolocate',
        icon: GeoLocateIcon,
        tooltip: 'Get Current Location',
        onClick: geoLocate
    }];

    return (
        <Box orientation="vertical" variant="dark">
            {controlsConfig.map(({ id, icon, onClick, tooltip, isActive }) => (
                <TooltipIconButton
                    key={id}
                    icon={icon}
                    label={tooltip}
                    onClick={onClick}
                    size="sm"
                    tooltipSide="right"
                    isActive={isActive}
                />
            ))}
        </Box>
    );
};
