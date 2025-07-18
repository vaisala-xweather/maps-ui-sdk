import { type AnyMapController, type ColorScaleOptions } from '@aerisweather/mapsgl';
import { type LayerState } from '@/types/layer';
import {
    buildWeatherLayerData,
    shouldInsertBelowAdmin,
    findFirstExistingLayerId,
    isCompositeLayer,
    convertValueForMapsGL,
    isWeatherLayerConfiguration,
    isCompositeWeatherLayer,
    getPaintProperty
} from '@/utils/layers';
import { type ValuePayload } from '@/types/action/dispatch';
import { LayerSchema } from '@/mapsgl/layerDataSchema';

export const addLayerToMap = (
    layer: LayerState,
    controller: AnyMapController,
    colorScales?: Record<string, ColorScaleOptions>
) => {
    try {
        const { layerId, weatherId, overrides } = layer;
        const isWeatherLayer = controller.weatherProvider.isWeatherLayer(weatherId);

        if (!isWeatherLayer) {
            if (!controller.getLayer(layerId)) {
                controller.addLayer(layerId, {});
            }
            return;
        }

        const layerConfig = controller.weatherProvider.getWeatherLayerConfig(weatherId);
        const defaultColorScale = isWeatherLayerConfiguration(layerConfig)
            ? layerConfig?.layer?.paint?.sample?.colorscale
            : undefined;

        const data = buildWeatherLayerData(
            layer,
            colorScales,
            defaultColorScale
        );
        const insertBelowAdmin = shouldInsertBelowAdmin(layerConfig);
        const beforeId = insertBelowAdmin
            ? findFirstExistingLayerId(controller, overrides?.beforeIds)
            : undefined;

        controller.addWeatherLayer(weatherId, data, beforeId);
    } catch (error) {
        console.error(`Failed to add layer [${layer.layerId}]:`, error);
    }
};

export const removeLayerFromMap = (layer: LayerState, controller: AnyMapController) => {
    try {
        const { layerId, weatherId } = layer;
        const isWeatherLayer = controller.weatherProvider.isWeatherLayer(weatherId);

        if (!isWeatherLayer) {
            if (controller.getLayer(layerId)) {
                controller.removeLayer(layerId);
            }
            return;
        }

        const config = controller.weatherProvider.getWeatherLayerConfig(weatherId);
        if (isCompositeLayer(config)) {
            config.forEach((compositeId: string) => {
                controller.removeWeatherLayer(compositeId);
            });
        } else {
            controller.removeWeatherLayer(weatherId);
        }
    } catch (error) {
        console.error(`Failed to remove layer [${layer.layerId}]:`, error);
    }
};

export const updateMapLayerSetting = (
    layer: LayerState,
    setting: ValuePayload,
    controller: AnyMapController,
    colorScales?: Record<string, ColorScaleOptions>
) => {
    try {
        const { id, value } = setting;
        const { layerId, weatherId, unitConversions } = layer;
        const isWeatherLayer = controller.weatherProvider.isWeatherLayer(weatherId);
        if (!isWeatherLayer) return;

        const mapLayer = controller.getLayer(layerId);
        if (!mapLayer) return;

        const config = controller.weatherProvider.getWeatherLayerConfig(weatherId);
        const defaultColorScale = isWeatherLayerConfiguration(config)
            ? config.layer?.paint?.sample?.colorscale
            : undefined;

        const unitConversion = unitConversions?.[id];
        const updatedValue = convertValueForMapsGL(
            value,
            id,
            unitConversion,
            colorScales,
            defaultColorScale
        );

        if (id === LayerSchema.data.quality && 'quality' in mapLayer) {
            mapLayer.quality = value;
        } else {
            mapLayer.setPaintProperty(getPaintProperty(id), updatedValue);
        }
    } catch (error) {
        console.error(`Failed to update layer setting [${layer.layerId}]:`, error);
    }
};

export function toggleLayerVisibility(
    layer: LayerState,
    controller: AnyMapController,
    colorScales: Record<string, ColorScaleOptions>
): void {
    if (isCompositeWeatherLayer(controller, layer)) {
        if (layer.active) {
            addLayerToMap(layer, controller, colorScales);
        } else {
            removeLayerFromMap(layer, controller);
        }
    } else {
        const mapLayer = controller.getLayer(layer.layerId);
        if (mapLayer) {
            if (layer.active) {
                mapLayer.show();
            } else {
                mapLayer.hide();
            }
        } else if (layer.active) {
            addLayerToMap(layer, controller, colorScales);
        }
    }
}
