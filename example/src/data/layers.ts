import '@xweather/mapsgl/dist/mapsgl.css';
import {
    type LayersConfig,
    LayerSchema,
    MEASUREMENT_TYPE, UNITS,
    customFiresStyle,
    customLightningStyle
} from '@xweather/maps-ui-sdk';
import {
    temperaturesButton,
    windSpeedSegments,
    temperatureContoursButton,
    dewPointButton,
    surfacePressureContour,
    humidityButton,
    feelsLikeButton
} from './buttons';

const { paint: { sample, opacity } } = LayerSchema;

export const layersConfig: LayersConfig = [{
    id: 'radar',
    title: 'Radar',
    selected: true,
    settingsOptions: [opacity,
        {
            name: sample.colorscalePath,
            value: 'Default'
        }, {
            name: sample.colorscale.interval,
            value: 10,
            optionProps: {
                units: {
                    measurementType: MEASUREMENT_TYPE.rate,
                    base: UNITS.rate.dbz,
                    precision: {
                        [UNITS.rate.dbz]: 0,
                        [UNITS.rate.inh]: 3,
                        [UNITS.rate.mmh]: 2
                    }
                }
            }

        }, {
            name: LayerSchema.data.quality,
            value: 'exact'
        }]
}, {
    id: 'satellite',
    title: 'Satellite',
    settingsOptions: [{
        name: opacity,
        value: 70
    }, {
        name: LayerSchema.data.quality,
        value: 'exact'
    }]
}, {
    title: 'Conditions',
    group: [
        {
            id: 'precip',
            title: 'Precipitation',
            value: 'precip'
        },
        temperaturesButton,
        {
            id: 'temperatures-custom',
            title: 'Temperatures',
            value: 'temperatures'
        },
        windSpeedSegments,
        temperatureContoursButton,
        dewPointButton,
        surfacePressureContour,
        humidityButton,
        feelsLikeButton
    ]
}, {
    title: 'Severe',
    group: [{
        id: 'alerts',
        title: 'Alerts',
        value: 'alerts',
        settingsOptions: [{
            name: opacity,
            value: 70
        }]
    }, {
        id: 'topical-cyclones',
        title: 'Tropical Cyclones',
        value: 'tropical-cyclones'
    }]
}, {
    title: 'Other',
    group: [{
        id: 'fires',
        title: 'Fires',
        value: 'fires-obs'
    }, {
        id: 'fires-custom',
        title: 'Fires: Custom',
        value: {
            id: 'fires-obs',
            overrides: {
                layer: customFiresStyle
            }

        }
    }, {
        id: 'lightning-custom',
        title: 'Lightning: Custom',
        value: {
            id: 'lightning-strikes',
            overrides: {
                layer: customLightningStyle
            }
        }
    }]
}];
