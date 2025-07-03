import {
    type LayerButtonOptions,
    type LayerButtonGroupOptions,
    type LayerSegmentedButtonOptions,
    MEASUREMENT_TYPE,
    UNITS,
    LayerSchema
} from '@xweather/maps-ui-sdk';
import { LayerTextControl } from '../components/LayerTextControl';
import { DrawRangeControl } from '../components/DrawRangeControl';

const { paint: { opacity, sample, grid, symbol, particle }, data } = LayerSchema;

export const radarButton: LayerButtonOptions = {
    id: 'radar',
    title: 'Radar',
    value: 'radar',
    settingsOptions: [opacity]
};

export const radarGlobalButton: LayerButtonOptions = {
    id: 'radar-global',
    title: 'Radar',
    value: 'radar-global',
    settingsOptions: [opacity]
};

export const alertsButton: LayerButtonOptions = {
    id: 'alerts',
    title: 'Alerts',
    value: 'alerts',
    selected: false,
    settingsOptions: [opacity]
};

export const temperaturesButton: LayerButtonOptions = {
    id: 'temperatures',
    title: 'Temperatures (with boundaries)',
    selected: true,
    value: {
        id: 'temperatures',
        overrides: {
            beforeIds: ['base.admin_3_4_boundaries.line', 'admin-1-boundary']
        }
    },
    settingsOptions: [
        opacity,
        {
            parentId: 'temperatures',
            component: LayerTextControl,
            name: 'temperatures-text',
            label: 'Show Text',
            value: true,
            className: 'w-40'
        },
        {
            name: sample.colorscalePath,
            options: ['Default', 'Inferno', 'Viridis', 'White']
        },
        {
            name: sample.colorscale.interval,
            value: 10,
            options: [0, 1, 2, 5, 10],
            optionProps: {
                units: {
                    measurementType: MEASUREMENT_TYPE.temperature,
                    base: UNITS.temperature.degF,
                    precision: {
                        [UNITS.temperature.degC]: 3,
                        [UNITS.temperature.degF]: 3
                    }
                }
            }
        },
        data.quality,
        {
            label: 'Range',
            className: 'w-48 gap-4',
            component: DrawRangeControl,
            name: sample.drawRangePath,
            min: -60,
            max: 120,
            value: [-60, 120],
            units: {
                measurementType: MEASUREMENT_TYPE.temperature,
                base: UNITS.temperature.degF
            }
        }
    ]
};

export const temperaturesCustomButton: LayerButtonOptions = {
    id: 'temperatures-custom',
    value: 'temperatures',
    title: 'Temperatures',
    selected: false,
    settingsOptions: [
        opacity,
        {
            parentId: 'temperatures-custom',
            component: LayerTextControl,
            name: 'temperatures-custom-text',
            weatherId: 'temperatures-text',
            label: 'Show Text',
            value: true,
            className: 'w-40',
            optionProps: {
                units: {
                    measurementType: MEASUREMENT_TYPE.temperature,
                    base: UNITS.temperature.degF
                }
            }
        },
        {
            name: sample.colorscalePath,
            options: ['Default', 'Inferno', 'Viridis']
        },
        sample.colorscale.interval,
        data.quality,
        {
            label: 'Range',
            className: 'w-48 gap-4',
            component: DrawRangeControl,
            name: sample.drawRangePath,
            units: {
                measurementType: MEASUREMENT_TYPE.temperature,
                base: UNITS.temperature.degF
            }
        }
    ]
};

export const temperatureContoursButton: LayerButtonOptions = {
    id: 'temperatures-contour',
    title: 'Temperature Contours',
    value: 'temperatures-contour',
    selected: false,
    settingsOptions: [
        data.quality,
        sample.smoothing
    ]
};

export const windsButton: LayerButtonOptions = {
    id: 'winds',
    title: 'Winds',
    value: 'wind-speeds:75,states-outlines-dk,wind-speeds-text-dk',
    settingsOptions: [opacity]
};

export const surfacePressureContour: LayerButtonOptions = {
    id: 'pressure-msl-contour',
    title: 'MSLP',
    value: 'pressure-msl-contour',
    settingsOptions: [
        {
            name: sample.interpolation,
            value: 2
        },
        data.quality
    ]
};

export const dewPointButton: LayerButtonOptions = {
    id: 'dew-points',
    title: 'Dew Point',
    value: 'dew-points',
    settingsOptions: [
        opacity,
        sample.colorscale.interval,
        sample.colorscalePath,
        data.quality
    ]
};

export const feelsLikeButton: LayerButtonOptions = {
    id: 'feels-like',
    title: 'Feels Like',
    value: 'feels-like',
    selected: false,
    settingsOptions: [
        opacity,
        sample.colorscale.interval
    ]
};

export const windSpeedSegments: LayerSegmentedButtonOptions = {
    id: 'wind',
    title: 'Winds',
    selected: false,
    multiselect: true,
    options: [{
        id: 'wind-barbs',
        title: 'Barbs',
        value: 'wind-barbs',
        settingsOptions: [grid.spacing, symbol.size]
    }, {
        id: 'wind-speeds',
        title: 'Fill',
        value: 'wind-speeds',
        selected: true,
        settingsOptions: [{
            name: sample.colorscale.interval,
            value: 5,
            optionProps: {
                units: {
                    measurementType: MEASUREMENT_TYPE.speed
                }
            }
        }]
    }, {
        id: 'wind-particles',
        title: 'Particles',
        value: 'wind-particles',
        selected: true,
        settingsOptions: [{
            name: sample.colorscalePath,
            value: 'White'
        },
        sample.smoothing,
        particle.speed,
        particle.size,
        particle.density,
        data.quality]
    }, {
        id: 'wind-chill',
        title: 'Wind Chill',
        value: 'wind-chill'
    }, {
        id: 'wind-dir',
        title: 'Wind Direction',
        value: 'wind-dir'
    }]
};

export const snowDepthButton: LayerButtonOptions = {
    id: 'snow-depth',
    title: 'Snow Depth',
    value: 'snow-depth',
    settingsOptions: [
        opacity,
        data.quality,
        sample.smoothing,
        sample.colorscale.interval
    ]
};

export const stormCellsSegments: LayerSegmentedButtonOptions = {
    id: 'stormcells',
    title: 'Storm Cells',
    selected: false,
    multiselect: true,
    options: [{
        id: 'stormcells-hail',
        title: 'Hail',
        value: 'stormcells-hail'
    }, {
        id: 'stormcells-rotating',
        title: 'Rotating',
        value: 'stormcells-rotating'
    }, {
        id: 'stormcells-tornadic',
        title: 'Tornadic',
        value: 'stormcells-tornadic'
    }, {
        id: 'stormcells-general',
        title: 'General',
        value: 'stormcells-general'
    }]
};

/*
 * {
 *   title: 'Storm Cells',
 *   value: 'stormcells'
 * },
 * {
 *   id: 'lightning',
 *   title: 'Lightning',
 *   value: 'lightning-strikes',
* settingsOptions: [
 * opacity]}
 * },
 * {
 *   id: 'tropical',
 *   title: 'Tropical Systems',
 *   value: 'tropical-cyclones'
 * },
 */

export const visibilityButton: LayerButtonOptions = {
    id: 'visibility',
    title: 'Visibility',
    value: 'visibility',
    settingsOptions: [opacity]
};

export const convectiveButton: LayerButtonOptions = {
    id: 'convective',
    title: 'Convective',
    value: 'convective',
    settingsOptions: [opacity]
};

export const fjetstreamButton: LayerButtonOptions = {
    id: 'fjet-stream',
    title: 'Jet Stream',
    value: 'fjet-stream',
    settingsOptions: [opacity]
};

export const heatIndexButton: LayerButtonOptions = {
    id: 'heat-index',
    title: 'Heat Index',
    value: 'heat-index',
    selected: false,
    settingsOptions: [
        opacity,
        sample.colorscalePath,
        sample.interpolation,
        {
            name: data.quality,
            value: 'exact'
        }
    ]
};

export const humidityButton: LayerButtonOptions = {
    id: 'humidity',
    title: 'Humidity',
    value: 'humidity',
    settingsOptions: [
        opacity,
        sample.colorscalePath,
        data.quality
    ]
};

export const airQualitySegments: LayerSegmentedButtonOptions = {
    id: 'airQuality',
    title: 'Air Quality',
    selected: false,
    options: [{
        id: 'air-quality-index',
        title: 'AQI',
        value: 'air-quality-index'
    }, {
        id: 'air-quality-index-categories',
        title: 'AQI: Categories',
        value: 'air-quality-index-categories'
    }, {
        id: 'air-quality-pm2p5',
        title: 'Particle Pollution (PM2.5)',
        value: 'air-quality-pm2p5'
    }, {
        id: 'air-quality-pm10',
        title: 'Particle Pollution (PM10)',
        value: 'air-quality-pm10'
    }, {
        id: 'air-quality-no',
        title: 'Nitrogen Monoxide (NO)',
        value: 'air-quality-no'
    }, {
        id: 'air-quality-no2',
        title: 'Nitrogen Dioxide (NO2)',
        value: 'air-quality-no2'
    }, {
        id: 'air-quality-co',
        title: 'Carbon Monoxide (CO)',
        value: 'air-quality-co'
    }, {
        id: 'air-quality-so2',
        title: 'Sulfur Dioxide (SO2)',
        value: 'air-quality-so2'
    }, {
        id: 'air-quality-o3',
        title: 'Ozone (O3)',
        value: 'air-quality-o3'
    }]
};

export const sstButton: LayerButtonOptions = {
    id: 'sst',
    title: 'Sea Surface Temps',
    value: 'sst',
    settingsOptions: [opacity]
};

export const currentsButton: LayerButtonOptions = {
    id: 'ocean-currents',
    title: 'Ocean Currents',
    value: 'ocean-currents',
    selected: true,
    settingsOptions: [opacity]
};

export const stormSurgeButton: LayerButtonOptions = {
    id: 'storm-surge',
    title: 'Storm Surge',
    value: 'storm-surge',
    settingsOptions: [opacity]
};

export const tideHeightsButton: LayerButtonOptions = {
    id: 'tide-heights',
    title: 'Tide Heights',
    value: 'tide-heights',
    settingsOptions: [opacity]
};

export const wavesSegments: LayerSegmentedButtonOptions = {
    id: 'waves',
    title: 'Waves',
    settingsOptions: [opacity],
    options: [{
        id: 'wave-heights',
        title: 'Wave Heights'
    }, {
        id: 'wave-periods',
        title: 'Wave Periods'
    }]
};

export const swell1Segments: LayerSegmentedButtonOptions = {
    id: 'swell-1',
    title: 'Swell 1',
    settingsOptions: [opacity],
    options: [{
        id: 'swell-heights',
        title: 'Swell Heights',
        value: 'swell-heights'
    }, {
        id: 'swell-periods',
        title: 'Swell Periods',
        value: 'swell-periods'
    }]
};

export const swell2Segments: LayerSegmentedButtonOptions = {
    id: 'swell-2',
    title: 'Swell 2',
    settingsOptions: [opacity],
    options: [{
        id: 'swell2-heights',
        title: 'Swell Heights',
        value: 'swell2-heights'
    }, {
        id: 'swell2-periods',
        title: 'Swell Periods',
        value: 'swell2-periods'
    }]
};

export const swell3Segments: LayerSegmentedButtonOptions = {
    id: 'swell-3',
    title: 'Swell 3',
    settingsOptions: [opacity],
    options: [{
        id: 'swell3-heights',
        title: 'Swell Heights',
        value: 'swell3-heights'
    }, {
        id: 'swell3-periods',
        title: 'Swell Periods',
        value: 'swell3-periods'
    }]
};

export const severityGroup: LayerButtonGroupOptions = {
    id: 'severity',
    title: 'Severity',
    group: [{
        id: 'alerts',
        title: 'Severe Alerts',
        selected: true

    },
    radarButton,
    {
        id: 'stormcells',
        title: 'Storm Cells',
        value: 'stormcells',
        selected: true
    },
    windSpeedSegments]
};

export const maritimeGroup: LayerButtonGroupOptions = {
    id: 'maritime',
    title: 'Maritime',
    group: [
        currentsButton,
        stormSurgeButton,
        tideHeightsButton,
        wavesSegments,
        swell1Segments,
        swell2Segments,
        swell3Segments,
        sstButton
    ]
};

export const generalGroup: LayerButtonGroupOptions = {
    id: 'general',
    title: 'General',
    group: [{
        id: 'satellite',
        title: 'Satellite',
        value: 'satellite',
        selected: false
    },
    temperaturesButton]
};
