import { MEASUREMENT_TYPE, UNITS } from '@/constants/units';
import { CONTROL_TYPE } from '@/constants/control';
import { ControlSetting } from '@/types/control';
import { NORMALIZED_COLOR_SCALES } from '@/constants/colors';
import { UnitButton } from '@/components/compositions/buttons/UnitButton';
import { ThumbnailButton } from '@/components/compositions/buttons/ThumbnailButton';
import { normalizeOptions } from '@/utils/control';
import { LayerSchema } from './layerDataSchema';

export interface ButtonOptions {
    id: string;
    value: any;
    title: string;
    options: any;
    state: any;
    onClick: () => void;
}

const { Inferno, RdYlBu, Viridis, Plasma, White } = NORMALIZED_COLOR_SCALES;

const SYMBOL_SIZE = [{ label: 'Sm', value: 10 },
    { label: '2', value: 20 },
    { label: '3', value: 30 },
    { label: '4', value: 40 },
    { label: 'Lg', value: 50 }];

const GRID_SPACING = [{ label: 'Low', value: 15 },
    { label: '2', value: 30 },
    { label: '3', value: 45 },
    { label: '4', value: 60 },
    { label: 'High', value: 75 }];

const SMOOTHING = [{ label: 'None', value: 0 },
    { label: 'Low', value: 0.4 },
    { label: '3', value: 0.6 },
    { label: '4', value: 0.8 },
    { label: 'High', value: 1 }];

const PARTICLE_SPEED = [{ label: '0.2x', value: 0.2 },
    { label: '0.5x', value: 0.5 },
    { label: '1x', value: 1 },
    { label: '2x', value: 2 },
    { label: '3x', value: 3 },
    { label: '4x', value: 4 }];

const PARTICLE_DENSITY = [{ label: 'Low', value: 8 },
    { label: '1', value: 24 },
    { label: '2', value: 48 },
    { label: '3', value: 76 },
    { label: 'High', value: 128 }];

const INTERPOLATION = [{ label: 'None', value: 0 },
    { label: 'Bilinear', value: 1 },
    { label: 'Bicubic', value: 2 }];

const QUALITY = [{ label: 'Lowest', value: 'minimal' },
    { label: 'Low', value: 'low' },
    { label: 'Normal', value: 'normal' },
    { label: 'High', value: 'high' },
    { label: 'Highest', value: 'exact' }];

const COLOR_SCALES = normalizeOptions([{ label: 'Default', value: 'Default' },
    { label: Inferno, value: Inferno },
    { label: RdYlBu, value: RdYlBu },
    { label: Viridis, value: Viridis },
    { label: Plasma, value: Plasma },
    { label: White, value: White }]);

const INTERVALS = [0, 1, 2, 5, 10];
const PARTICLE_SIZE = [1, 2, 3, 4];

export type LayerControlKey = keyof typeof LAYER_CONTROL_DATA;

const { paint: { opacity, sample, symbol, particle, grid }, data } = LayerSchema;

export const LAYER_CONTROL_DATA: { [k: string]: ControlSetting } = {
    [opacity]: {
        label: 'Opacity',
        value: 100,
        controlType: CONTROL_TYPE.slider,
        name: opacity,
        min: 0,
        max: 100,
        step: 1,
        className: 'xw-w-48',
        units: {
            measurementType: MEASUREMENT_TYPE.ratio,
            base: UNITS.ratio.percent
        }
    },
    [sample.colorscale.interval]: {
        label: 'Color Interval',
        value: 0,
        controlType: CONTROL_TYPE.radioGroup,
        name: sample.colorscale.interval,
        options: INTERVALS,
        optionProps: {
            component: UnitButton,
            units: {
                measurementType: MEASUREMENT_TYPE.temperature,
                base: UNITS.temperature.degF
            }
        },
        className: 'xw-w-40',
        layout: {
            itemsPerRow: 3,
            growLastItem: true
        }
    },
    [sample.smoothing]: {
        label: 'Smoothing',
        value: 1,
        controlType: CONTROL_TYPE.radioGroup,
        name: sample.smoothing,
        options: SMOOTHING,
        className: 'xw-w-40',
        layout: {
            itemsPerRow: 3,
            firstItemFullWidth: true,
            growLastItem: true
        }
    },
    [sample.interpolation]: {
        label: 'Interpolation',
        value: 1,
        controlType: CONTROL_TYPE.radioGroup,
        name: sample.interpolation,
        options: INTERPOLATION,
        className: 'xw-w-40',
        layout: {
            itemsPerRow: 2,
            firstItemFullWidth: true
        }
    },
    [symbol.size]: {
        label: 'Symbol Size',
        value: 50,
        controlType: CONTROL_TYPE.radioGroup,
        name: symbol.size,
        options: SYMBOL_SIZE,
        className: 'xw-w-40',
        layout: {
            itemsPerRow: 3,
            firstItemFullWidth: true,
            growLastItem: true
        }
    },
    [grid.spacing]: {
        label: 'Grid Spacing',
        value: 75,
        controlType: CONTROL_TYPE.radioGroup,
        name: grid.spacing,
        options: GRID_SPACING,
        className: 'xw-w-40',
        layout: {
            itemsPerRow: 3,
            firstItemFullWidth: true,
            growLastItem: true
        }
    },
    [particle.size]: {
        label: 'Particle Size',
        value: 2,
        controlType: CONTROL_TYPE.radioGroup,
        name: particle.size,
        options: PARTICLE_SIZE,
        className: 'xw-w-40',
        layout: {
            itemsPerRow: 4
        }
    },
    [particle.density]: {
        label: 'Particle Density',
        value: 76,
        controlType: CONTROL_TYPE.radioGroup,
        name: particle.count,
        options: PARTICLE_DENSITY,
        className: 'xw-w-40',
        layout: {
            itemsPerRow: 3,
            firstItemFullWidth: true,
            growLastItem: true
        }
    },
    [particle.speed]: {
        label: 'Particle Speed',
        value: 1,
        controlType: CONTROL_TYPE.radioGroup,
        name: particle.speed,
        options: PARTICLE_SPEED,
        className: 'xw-w-40',
        layout: {
            itemsPerRow: 3
        }
    },
    [data.quality]: {
        label: 'Quality',
        value: 'normal',
        controlType: CONTROL_TYPE.select,
        name: data.quality,
        options: QUALITY,
        className: `xw-w-40 xw-bg-transparent xw-border xw-border-slate-500 
                    xw-rounded xw-text-white xw-px-1 xw-py-1 xw-opacity-70`
    },
    [sample.colorscalePath]: {
        label: 'Color',
        value: 'Default',
        controlType: CONTROL_TYPE.radioGroup,
        name: sample.colorscalePath,
        options: COLOR_SCALES,
        optionProps: {
            component: ThumbnailButton
        },
        className: 'xw-w-40',
        layout: {
            itemsPerRow: 1,
            firstItemFullWidth: true
        }
    }
};
