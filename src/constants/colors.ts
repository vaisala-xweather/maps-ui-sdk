import { ColorScale } from '@/types/colors';
import { inToMM, inToM } from '@/utils/units';

export const TEMPERATURE_COLOR_SCALE: ColorScale = [
    -90, '#bef7ff',
    -84.44, '#00c7fb',
    -78.89, '#0075b6',
    -73.33, '#1B0084',
    -67.78, '#6100FF',
    -62.22, '#D592FF',
    -56.67, '#D150FF',
    -51.111111111111, '#8f00ca',
    -45.555555555556, '#630078',
    -40, '#a50099',
    -34.444444444444, '#ed00dc',
    -28.888888888889, '#f671ff',
    -23.333333333333, '#dcc1ed',
    -17.777777777778, '#1b007b',
    -12.222222222222, '#6e51ff',
    -6.6666666666667, '#9bb6ff',
    -1.1111111111111, '#18a5fc',
    4.4444444444444, '#0900e7',
    10, '#14b000',
    15.555555555556, '#f5d508',
    21.111111111111, '#e17200',
    26.666666666667, '#f33300',
    32.222222222222, '#d00000',
    37.777777777778, '#720000',
    43.333333333333, '#ce0046',
    48.888888888889, '#ff4b98',
    54.44, '#ffadad',
    60, '#9f0000',
    65.56, '#ca4931',
    71.11, '#e9a696'
];

export const WIND_SPEED_COLOR_SCALE: ColorScale = [
    0, '#e4e8f1',
    1.1176, '#0050ff',
    3.3528, '#1bd3ff', // 5 mph
    4.4704, '#34ff87',
    5.588, '#72ff09',
    6.7056, '#b4ff08',
    7.8232, '#efff0b',
    8.9408, '#fee20a',
    11.176, '#f0b90a',
    13.4112, '#ed9909', // 30 mph
    15.6464, '#fd8609',
    17.8816, '#fd5d08',
    20, '#fb3706',
    22.352, '#c71506', // 50 mph
    26.8224, '#931506',
    31.2928, '#931562', // 70 mph
    35.7632, '#b219aa',
    40, '#ee22e3',
    44.704, '#ff91f9', // 100 mph,
    49.17, '#ffcafc',
    53.64, '#ffe9f5'
];

export const SNOW_DEPTH_COLOR_SCALE: ColorScale = [
    0, 'rgba(96,96,96,0)',
    inToM(0.01), 'rgba(96,96,96,0)',
    inToM(0.1), 'rgba(96,96,96,0.5)',
    inToM(1), '#888888',
    inToM(3), '#85D3FF',
    inToM(6), '#25B4FF',
    inToM(12), '#012DFF',
    inToM(18), '#7000D9',
    inToM(24), '#FF49C4',
    inToM(48), '#FFECF7',
    inToM(72), '#36E2F4',
    inToM(120), '#007682',
    inToM(168), '#C38EF2',
    inToM(240), '#A34AF2',
    inToM(300), '#7100FF'
];

export const PRECIP_ACCUMULATION_COLOR_SCALE: ColorScale = [
    0, '#e4e8f1',
    inToMM(0.1), '#B8FF9C',
    inToMM(1.5), '#0E6D02',
    inToMM(2.5), '#FFFC0B',
    inToMM(4.5), '#EE0000',
    inToMM(5.5), '#7C0000',
    inToMM(7.5), '#FF6AC6',
    inToMM(8.5), '#BA01F4'
];

export const NORMALIZED_COLOR_SCALES = {
    Viridis: 'Viridis',
    Inferno: 'Inferno',
    Plasma: 'Plasma',
    Magma: 'Magma',
    Cividis: 'Cividis',
    Mako: 'Mako',
    Rocket: 'Rocket',
    Turbo: 'Turbo',
    OrRd: 'OrRd',
    PuBu: 'PuBu',
    BuPu: 'BuPu',
    Oranges: 'Oranges',
    BuGn: 'BuGn',
    YlOrBr: 'YlOrBr',
    YlGn: 'YlGn',
    Reds: 'Reds',
    RdPu: 'RdPu',
    Greens: 'Greens',
    YlGnBu: 'YlGnBu',
    Purples: 'Purples',
    GnBu: 'GnBu',
    Greys: 'Greys',
    YlOrRd: 'YlOrRd',
    PuRd: 'PuRd',
    Blues: 'Blues',
    PuBuGn: 'PuBuGn',
    Spectral: 'Spectral',
    RdYlGn: 'RdYlGn',
    RdBu: 'RdBu',
    PiYG: 'PiYG',
    PRGn: 'PRGn',
    RdYlBu: 'RdYlBu',
    BrBG: 'BrBG',
    RdGy: 'RdGy',
    PuOr: 'PuOr',
    Set2: 'Set2',
    Accent: 'Accent',
    Set1: 'Set1',
    Set3: 'Set3',
    Dark2: 'Dark2',
    Paired: 'Paired',
    Pastel2: 'Pastel2',
    Pastel1: 'Pastel1',
    Rainbow: 'Rainbow',
    Sinebow: 'Sinebow',
    White: 'White',
    Black: 'Black'
} as const;
