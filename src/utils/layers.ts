import { deepMerge, get } from '@aerisweather/javascript-utils';
import {
    type ColorScaleOptions,
    type WeatherLayerConfiguration,
    type AnyMapController,
    type LayerType
} from '@aerisweather/mapsgl';
import {
    type LayerButtonOptionSetting,
    type LayerSettings,
    type LayersState,
    type LayersConfig,
    type LayerButtonOptions,
    type LayerState,
    type InitialLayerState,
    type LayersConfigItem
} from '@/types/layer';
import {
    type ControlSetting,
    type ToggleGroupSetting,
    type RadioGroupSetting,
    type SelectSetting,
    type CustomSetting,
    type SliderSetting,
    type ControlUnits
} from '@/types/control';
import { LAYER_CONTROL_DATA } from '@/mapsgl/layerControl';
import { LayerSchema } from '@/mapsgl/layerDataSchema';
import { deepClone } from '@/utils/clone';
import { getObjectUpdatedByPath } from '@/utils/object';
import { isString, isObject } from '@/utils/typeGuard';
import { CONTROL_TYPE } from '@/constants/control';
import { normalizeOptions } from '@/utils/control';
import { MeasurementType, MapsGLUnitConversion, MapsGLUnitConversionTarget } from '@/types/units';
import { UNITS, MEASUREMENT_TYPE, MEASUREMENT_TYPE_API_MAPPINGS } from '@/constants/units';
import { convert } from '@/utils/units';
import { isValidMapsGLLayerProperty, convertToMapsGLValue } from '@/constants/valueConverterMapping';
import { isMeasurementType } from '@/utils/unitTypeGuards';

export const isCompositeLayer = (layerConfig: unknown): layerConfig is string[] => Array.isArray(layerConfig);

export const isWeatherLayerConfiguration = (
    config: string[] | WeatherLayerConfiguration | undefined | null
): config is WeatherLayerConfiguration => (
    !Array.isArray(config)
    && config !== undefined
    && config !== null
    && 'layer' in config
);

/**
 * Retrieves the unit configuration from a control setting.
 * Units can be defined either directly on the setting or within its optionProps.
 *
 * @param setting - The control setting to check for units
 * @returns The unit configuration if found, undefined otherwise
 */
const getSettingUnits = (setting: Partial<ControlSetting>): ControlUnits | undefined => {
    if ('optionProps' in setting && setting.optionProps?.units) {
        return setting.optionProps.units as ControlUnits;
    }

    if ('units' in setting) {
        return setting.units as ControlUnits;
    }

    return undefined;
};

/**
 * Gets unit conversion configuration for a control setting if applicable.
 *
 * @param units - the units configuration for the control setting
 * @returns MapsGL Unit conversion if there is a valid unit based on measurementType, undefined otherwise
 */
const getUnitConversion = (
    units: ControlUnits,
    weatherId: string
): MapsGLUnitConversion | undefined => {
    const { measurementType, base, scaleConversion } = units;
    const mapsGLUnit = getMapsGLUnit(measurementType, weatherId);

    if (!mapsGLUnit) return undefined;

    return {
        scaleConversion,
        measurementType,
        from: base ?? mapsGLUnit,
        to: mapsGLUnit
    };
};

/**
 * Normalizes a layer config item into an array of LayerButtonOptions with proper selection states
 *
 * @param item - Config item that could be a group, segmented button, or individual layer
 * @param activeGroupId - Optional ID of currently active group
 * @returns Array of normalized LayerButtonOptions
 */

const normalizeLayerConfig = (
    item: LayersConfigItem,
    activeGroupId?: string | null
): LayerButtonOptions[] => {
    const effectiveSelected = activeGroupId ? false : (item.selected ?? true);

    if ('group' in item) {
        return item.group.flatMap((layer) => {
            if ('options' in layer) {
                const segmentSelected = layer.selected && effectiveSelected;
                return layer.options.map((option) => ({
                    ...option,
                    selected: option.selected && segmentSelected,
                    groupId: item.id
                }));
            }
            return [{
                ...layer,
                selected: layer.selected && effectiveSelected,
                groupId: item.id
            }];
        });
    }

    if ('options' in item) {
        const segmentSelected = (item.selected ?? false) && effectiveSelected;
        return item.options.map((option) => ({
            ...option,
            selected: option.selected && segmentSelected
        }));
    }

    return [{
        ...item,
        selected: (item.selected ?? false) && effectiveSelected
    }];
};

const computeWeatherId = (layer: LayerButtonOptions): string => (isString(layer.value)
    ? layer.value
    : layer.value?.id ?? layer.id);

const addLayerToState = (
    layersState: LayersState,
    layer: LayerButtonOptions & { groupId?: string },
    controller: AnyMapController
) => {
    const unitConversions: Record<string, MapsGLUnitConversion> = {};
    const childLayerIds: string[] = [];
    const currentState = deepClone(layersState);
    const effectiveWeatherId = computeWeatherId(layer);

    const isSegmentOption = 'options' in layer && Array.isArray(layer.options);
    const isSelected = layer.selected ?? false;
    const isActive = isSegmentOption
        ? isSelected && (layer.selected ?? false)
        : isSelected;

    const settings = layer.settingsOptions?.reduce((updatedSettings, controlSetting) => {
        if (typeof controlSetting === 'string') {
            return handleStringControlSetting(controlSetting, updatedSettings, controller, effectiveWeatherId);
        }

        if (!controlSetting?.name) {
            console.warn('Control setting missing required name property');
            return updatedSettings;
        }
        const units = getSettingUnits(controlSetting);
        if (units) {
            const updatedUnits = configureUnits(units, controlSetting.name, effectiveWeatherId);
            const unitConversion = getUnitConversion(updatedUnits, effectiveWeatherId);
            if (unitConversion) {
                unitConversions[controlSetting.name] = unitConversion;
            }
        }
        if ('parentId' in controlSetting && controlSetting.parentId) {
            try {
                const {
                    id,
                    name,
                    weatherId,
                    value,
                    parentId,
                    ...rest
                } = controlSetting;

                if (!currentState[parentId]) {
                    currentState[parentId] = buildBaseLayerState({
                        layerId: parentId,
                        weatherId: parentId,
                        active: false,
                        childLayerIds: [],
                        groupId: layer.groupId
                    });
                }

                const childLayerId = id ?? name;
                childLayerIds.push(childLayerId);

                const childLayer = buildBaseLayerState({
                    layerId: childLayerId,
                    weatherId: weatherId ?? childLayerId,
                    active: isActive && Boolean(value),
                    parentId,
                    groupId: layer.groupId,
                    ...rest
                });

                currentState[childLayerId] = childLayer;

                return {
                    ...updatedSettings,
                    [name]: value
                };
            } catch (error) {
                console.warn('Error processing child layer:', error);
                return updatedSettings;
            }
        }
        const defaultControlSetting = LAYER_CONTROL_DATA[controlSetting.name];
        let value = controlSetting.value;
        if (value === undefined) {
            const layerConfig = controller.weatherProvider.getWeatherLayerConfig(effectiveWeatherId);
            if (isWeatherLayerConfiguration(layerConfig)
                && controlSetting.name !== LayerSchema.paint.sample.colorscalePath) {
                if (controlSetting.name === LayerSchema.paint.sample.drawRangePath) {
                    const range = get(layerConfig.layer, LayerSchema.paint.sample.colorscale.range);
                    const drawRange = get(layerConfig.layer, LayerSchema.paint.sample.drawRangePath);
                    value = [
                        controlSetting.value?.min ?? drawRange?.min ?? range.min,
                        controlSetting.value?.max ?? drawRange?.max ?? range.max
                    ];
                } else {
                    value = get(layerConfig.layer, controlSetting.name);
                }
            } else {
                value = null;
            }
        }

        return {
            ...updatedSettings,
            [controlSetting.name]: value ?? defaultControlSetting?.value ?? null
        };
    }, {} as LayerSettings);

    currentState[layer.id] = createLayerState(layer, {
        active: isActive,
        settings,
        childLayerIds,
        unitConversions,
        groupId: layer.groupId
    });
    return currentState;
};

/**
 * Transforms a layers configuration into a normalized layer state object
 *
 * @param layersConfig - Array of layer configurations
 * @param controller - MapsGL controller
 * @param activeGroupId - Optional ID of currently active group
 * @returns Normalized layer state object
 */
export const layerStateFromConfig = (
    layersConfig: LayersConfig,
    controller: AnyMapController,
    activeGroupId?: string | null
): LayersState => {
    const normalizedLayers = layersConfig.flatMap((layer) => normalizeLayerConfig(layer, activeGroupId));
    return normalizedLayers.reduce(
        (state, layer) => addLayerToState(state, layer, controller),
        {} as LayersState
    );
};

/**
 * Processes a string-based control setting, retrieving its configuration
 * and default value from MapsGL if available
 */
const handleStringControlSetting = (
    controlSetting: string,
    settings: LayerSettings,
    controller: AnyMapController,
    weatherId: string
): LayerSettings => {
    const defaultControlSetting = LAYER_CONTROL_DATA[controlSetting];
    if (!defaultControlSetting) {
        console.warn(`No default control setting found for "${controlSetting}"`);
        return settings;
    }

    const config = controller.weatherProvider.getWeatherLayerConfig(weatherId);
    const defaultValue = isWeatherLayerConfiguration(config)
    && controlSetting !== LayerSchema.paint.sample.colorscalePath
        ? get(config.layer, controlSetting)
        : undefined;
    return {
        ...settings,
        [defaultControlSetting.name]: defaultValue ?? defaultControlSetting.value ?? null
    };
};

const mapValueFromLayerSettings = (
    controlSetting: ControlSetting,
    layerSettings: LayerSettings | undefined
): ControlSetting => {
    const value = layerSettings?.[controlSetting.name];
    if (value === undefined) return controlSetting;

    switch (controlSetting.controlType) {
        case CONTROL_TYPE.toggleGroup: {
            const toggleGroupSetting = controlSetting as ToggleGroupSetting;
            toggleGroupSetting.value = toggleGroupSetting.multiSelect
                ? value as string[] | number[]
                : (value ?? null) as string | number | null;
            return toggleGroupSetting;
        }

        case CONTROL_TYPE.radioGroup: {
            const radioGroupSetting = controlSetting as RadioGroupSetting;
            radioGroupSetting.value = value as string | number;
            return radioGroupSetting;
        }

        case CONTROL_TYPE.select: {
            const selectSetting = controlSetting as SelectSetting;
            selectSetting.value = value as string | number;
            return selectSetting;
        }

        case CONTROL_TYPE.slider: {
            const sliderSetting = controlSetting as SliderSetting;
            sliderSetting.value = value as number;
            return sliderSetting;
        }

        default: {
            const customSetting = controlSetting as CustomSetting;
            customSetting.value = value;
            return customSetting;
        }
    }
};

const mapColorScaleOptions = (
    controlSetting: ControlSetting,
    layerId: string
): ControlSetting => {
    if ('options' in controlSetting && Array.isArray(controlSetting.options)) {
        controlSetting.options = normalizeOptions(controlSetting.options).map((option) => ({
            ...option,
            id: option.id === 'Default' ? layerId : option.id
        }));
    }

    return controlSetting;
};

const isColorScaleSetting = (setting: LayerButtonOptionSetting): boolean => {
    if (typeof setting === 'string') {
        return setting === LayerSchema.paint.sample.colorscalePath;
    } if (typeof setting === 'object' && setting.name) {
        return setting.name === LayerSchema.paint.sample.colorscalePath;
    }
    return false;
};

/**
 * Configures unit settings for measurement types
 * Sets scaleConversion to true if the setting is a temperature colorscale interval
 * - should never use absolute units in this case
 *
 * @param units - The units configuration to update
 * @param settingName - The name of the setting these units belong to
 * @param weatherId - The weather layer ID
 * @returns Updated units configuration
 */
const configureUnits = (
    units: ControlUnits,
    settingName: string,
    weatherId: string
): ControlUnits => {
    const { measurementType } = units;
    const updatedUnits = { ...units };

    if (!updatedUnits.base) {
        const mapsGLUnit = getMapsGLUnit(measurementType, weatherId);
        if (mapsGLUnit) {
            updatedUnits.base = mapsGLUnit;
        }
    }

    if (settingName === LayerSchema.paint.sample.colorscale.interval
        && measurementType === MEASUREMENT_TYPE.temperature) {
        updatedUnits.scaleConversion = true;
    }

    return updatedUnits;
};

const buildControlSetting = (
    setting: LayerButtonOptionSetting,
    layerConfig: string[] | WeatherLayerConfiguration | undefined,
    weatherId: string
): ControlSetting => {
    let controlSetting: ControlSetting;

    if (typeof setting === 'string') {
        const defaultControlSetting = LAYER_CONTROL_DATA[setting];
        if (!defaultControlSetting) {
            throw new Error(`Control setting "${setting}" does not exist.`);
        }
        controlSetting = deepClone(defaultControlSetting);
    } else {
        if (!setting.name) {
            throw new Error('Setting overrides must have a "name" property.');
        }

        const defaultControlSetting = LAYER_CONTROL_DATA[setting.name];

        if (defaultControlSetting) {
            controlSetting = deepMerge(deepClone(defaultControlSetting), setting);
        } else if (layerConfig
             && !Array.isArray(layerConfig)
             && setting.name === LayerSchema.paint.sample.drawRangePath) {
            const range = get(layerConfig.layer, LayerSchema.paint.sample.colorscale.range);
            const drawRange = get(layerConfig.layer, LayerSchema.paint.sample.drawRangePath);
            controlSetting = {
                min: drawRange?.min ?? range.min,
                max: drawRange?.max ?? range.max,
                ...setting
            } as ControlSetting;
        } else {
            controlSetting = setting as ControlSetting;
        }
    }

    const units = getSettingUnits(controlSetting);
    if (units) {
        const updatedUnits = configureUnits(units, controlSetting.name, weatherId);

        if ('optionProps' in controlSetting && controlSetting.optionProps?.units) {
            controlSetting.optionProps.units = updatedUnits;
        } else if ('units' in controlSetting) {
            controlSetting.units = updatedUnits;
        }
    }

    return controlSetting;
};

/**
 * Retrieves and processes control settings for a layer.
 * Handles string-based settings (using defaults), object-based settings (with overrides),
 * and custom settings that don't exist in LAYER_CONTROL_DATA.
 * Special handling for colorscale settings to map option with id 'Default' to the layer's ID.
 * so the color scale control (default: ThumbnailButton) can determine which color scale to use
 *
 * @param layerId - The ID of the layer these settings are for
 * @param settingsOptions - Array of setting configurations from the layer
 * @param settingsState - Current settings state for the layer
 * @returns Array of processed control settings
 */
export const getControlSettings = (
    controller: AnyMapController,
    layer: LayerState,
    settingsOptions: LayerButtonOptionSetting[],
    settingsState: LayerSettings | undefined
): ControlSetting[] => settingsOptions.map((setting) => {
    const layerConfig = controller.weatherProvider.getWeatherLayerConfig(layer.weatherId);
    let controlSetting = buildControlSetting(setting, layerConfig, layer.weatherId);

    // If inline options are provided, override them if they exist instead of merging.
    if (typeof setting === 'object'
            && 'options' in setting
            && 'options' in controlSetting
            && Array.isArray(setting.options)) {
        controlSetting.options = setting.options;
    }
    controlSetting = mapValueFromLayerSettings(controlSetting, settingsState);

    if (isColorScaleSetting(setting)) {
        controlSetting = mapColorScaleOptions(controlSetting, layer.layerId);
    }

    return controlSetting;
});

/**
 * Unified function to handle all value conversions for MapsGL
 * @param value The original value to convert
 * @param propertyId The property ID being set
 * @param unitConversion Optional unit conversion configuration
 * @param colorScales Optional color scales for colorscale properties
 * @param defaultColorScale Default color scale to use when value is 'Default'
 * @returns The converted value ready for MapsGL
 */
export const convertValueForMapsGL = (
    value: any,
    propertyId: string,
    unitConversion?: MapsGLUnitConversion,
    colorScales?: Record<string, ColorScaleOptions>,
    defaultColorScale?: ColorScaleOptions
): any => {
    let convertedValue = value;

    if (unitConversion) {
        convertedValue = convertUnitsToMapsGLUnits(convertedValue, unitConversion);
    }

    if (propertyId === LayerSchema.paint.sample.colorscalePath && colorScales && typeof value === 'string') {
        convertedValue = value === 'Default'
            ? defaultColorScale
            : getColorScaleData(colorScales, value);
    } else if (isValidMapsGLLayerProperty(propertyId)) {
        convertedValue = convertToMapsGLValue(propertyId, convertedValue);
    }

    return convertedValue;
};

/**
 * Converts settings values based on their property type.
 * Handles special cases like colorscales and numeric conversions.
 * @param layerSettings - The settings object containing properties to convert
 * @param unitConversions - Optional unit conversions for the layer
 * @param colorScales - Optional color scales available to the layer
 * @param defaultColorScale - Optional default color scale from MapsGL layer config
 * @returns Object with converted settings values
 */

export const getLayerSettingsWithConvertedValues = (
    layerSettings: LayerSettings,
    unitConversions?: Record<string, MapsGLUnitConversion>,
    colorScales?: Record<string, ColorScaleOptions>,
    defaultColorScale?: ColorScaleOptions
) => Object.keys(layerSettings)?.reduce((state, property) => {
    const unitConversion = unitConversions?.[property];
    const value = layerSettings[property];

    const convertedValue = convertValueForMapsGL(
        value,
        property,
        unitConversion,
        colorScales,
        defaultColorScale
    );

    return {
        ...state,
        ...addPropertyToLayerData(state, property, convertedValue)
    };
}, {});

/**
 * Retrieves color scale data for a given value.
 * @param colorScales - Available color scales
 * @param value - Color scale identifier or 'Default'
 * @returns ColorScaleOptions for the requested scale
 */
export const getColorScaleData = (colorScales: Record<string, ColorScaleOptions>, value: string): ColorScaleOptions => {
    const targetTheme = colorScales[value];
    return targetTheme ? deepMerge({}, targetTheme) : {};
};

/**
 * Removes 'paint.' prefix from a property string if it exists
 * @param property - The property string that may contain 'paint.' prefix
 * @returns The property string without the 'paint.' prefix
 */
export const getPaintProperty = (property: string): string => (
    property.startsWith('paint.')
        ? property.slice(6)
        : property);

export const addPropertyToLayerData = (state: any, property: string, value: any) => {
    const updatedObject = getObjectUpdatedByPath(state, property, value);
    return updatedObject;
};

const getMapsGLUnit = (
    measurementType: MeasurementType | 'depth',
    weatherId: string
): MapsGLUnitConversionTarget | undefined => {
    const isRadar = weatherId === 'radar';

    // TODO: Add depth measurement type

    if (measurementType === 'depth') {
        return UNITS.distance.m;
    }

    if (!isMeasurementType(measurementType)) {
        return undefined;
    }

    if (measurementType === 'rate' && isRadar) {
        return UNITS.rate.dbz;
    }

    return MEASUREMENT_TYPE_API_MAPPINGS[measurementType]?.mapsgl.unitConversionTarget;
};

export const convertUnitsToMapsGLUnits = (
    settingValue: string | number | string[] | number[],
    unitConversion: MapsGLUnitConversion
) => {
    const { measurementType, from, to, scaleConversion } = unitConversion;
    const unitConverter = (value: string | number) => (
        convert(measurementType, Number(value), from, to, scaleConversion)
    );

    if (Array.isArray(settingValue)) {
        return settingValue.map((value) => unitConverter(value));
    }

    return unitConverter(settingValue);
};

export const isCompositeWeatherLayer = (controller: AnyMapController, layer: LayerState): boolean => {
    const { weatherId } = layer;
    const isWeather = controller.weatherProvider.isWeatherLayer(weatherId);
    if (!isWeather) return false;

    const layerConfig = controller.weatherProvider.getWeatherLayerConfig(weatherId);
    return isCompositeLayer(layerConfig);
};

export const shouldInsertBelowAdmin = (layerConfig: string[] | WeatherLayerConfiguration | undefined): boolean => {
    if (!layerConfig || isCompositeLayer(layerConfig)) return false;
    if (isWeatherLayerConfiguration(layerConfig)) {
        const layerType: LayerType | undefined = layerConfig.layer.type;
        return layerType
            ? !['line', 'circle', 'text', 'symbol', 'query'].includes(layerType)
            : false;
    }
    return false;
};

export const findFirstExistingLayerId = (controller: AnyMapController, layerIds?: string[]): string | undefined => {
    if (!layerIds) return undefined;
    return layerIds.find((id) => controller.getLayer(id) !== undefined);
};

export const buildWeatherLayerData = (
    layer: LayerState,
    colorScales?: Record<string, ColorScaleOptions>,
    defaultColorScale?: ColorScaleOptions
) => {
    const { layerId, settings, overrides, unitConversions } = layer;
    const layerSettings = settings
        ? getLayerSettingsWithConvertedValues(settings, unitConversions, colorScales, defaultColorScale)
        : {};
    const mergedSettingsWithOverrides = deepMerge(layerSettings, overrides?.layer ?? {});
    mergedSettingsWithOverrides.id = layerId;
    return mergedSettingsWithOverrides;
};

/**
 * Creates a layer state object from a layer configuration and additional properties.
 *
 * @param layer - The layer configuration
 * @param props - Additional properties for the layer state
 * @returns The complete layer state object
 */
const createLayerState = (
    layer: LayerButtonOptions,
    props: {
        active: boolean;
        settings?: LayerSettings;
        childLayerIds: string[];
        unitConversions: Record<string, MapsGLUnitConversion>;
        groupId?: string;
    }
): LayerState => {
    const weatherId = computeWeatherId(layer);
    const overrides = isObject(layer.value) ? layer.value.overrides : undefined;

    return buildBaseLayerState({
        layerId: layer.id,
        weatherId,
        active: props.active,
        settings: props.settings,
        overrides,
        childLayerIds: props.childLayerIds,
        unitConversions: props.unitConversions,
        groupId: props.groupId
    });
};

/**
 * Builds the base LayerState with common properties.
 */
export const buildBaseLayerState = ({
    layerId,
    weatherId,
    active = false,
    settings,
    overrides,
    childLayerIds,
    unitConversions,
    parentId,
    groupId
}: InitialLayerState): LayerState => ({
    layerId,
    weatherId: weatherId ?? layerId,
    active,
    ...(settings && { settings }),
    ...(overrides && { overrides }),
    ...(childLayerIds && { childLayerIds }),
    ...(unitConversions && { unitConversions }),
    ...(parentId && { parentId }),
    ...(groupId && { groupId })
});
