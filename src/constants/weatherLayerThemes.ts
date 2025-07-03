import { FtoC } from '@/utils/units';

export interface ThemeConfig {
    id: string;
    title: string;
    value: Array<number | string> | { normalized: boolean; stops: Array<number | string>; };
}

export const GENERAL = {
    viridis: {
        id: 'viridis',
        title: 'Viridis',
        value: {
            normalized: true,
            stops: [
                0, '#450055',
                0.25, '#433b86',
                0.5, '#178e8e',
                0.75, '#4ac666',
                1, '#fee900'
            ]
        }
    },
    plasma: {
        id: 'plasma',
        title: 'Plasma',
        value: {
            normalized: true,
            stops: [
                0, '#0b0089',
                0.25, '#8800a8',
                0.5, '#cf4875',
                0.75, '#f99336',
                1, '#f0fb00'
            ]
        }
    },
    inferno: {
        id: 'inferno',
        title: 'Inferno',
        value: {
            normalized: true,
            stops: [
                0, '#fcfca3',
                0.25, '#fcae12',
                0.5, '#b83779',
                0.75, '#641a80',
                1, '#000004'
            ]
        }
    },
    rdylbu: {
        id: 'rdylbu',
        title: 'RdYlBu',
        value: {
            normalized: true,
            stops: [
                0, '#2c7bb6',
                0.25, '#abd9e9',
                0.5, '#ffffbf',
                0.75, '#fdae61',
                1, '#d7191c'
            ]
        }
    }
};

export const MONOCHROME = {
    black: {
        id: 'black',
        title: 'Black',
        value: {
            normalized: true,
            stops: [
                0, '#000000',
                1, '#000000'
            ]
        }
    },
    white: {
        id: 'white',
        title: 'White',
        value: {
            normalized: true,
            stops: [
                0, '#ffffff',
                1, '#ffffff'
            ]
        }
    }
};

export const THEME_1 = {
    temps: {
        id: 'theme1',
        title: 'Theme 1',
        value: {
            stops: [
                FtoC(20), '#ecb9ec',
                FtoC(30), '#d670d9',
                FtoC(40), '#8c36ba',
                FtoC(50), '#322896',
                FtoC(55), '#1c55b9',
                FtoC(60), '#06b9e1',
                FtoC(70), '#02d577',
                FtoC(75), '#14c00a',
                FtoC(80), '#6ccf04',
                FtoC(90), '#fffa01',
                FtoC(100), '#fa6e01',
                FtoC(110), '#cf2202',
                FtoC(120), '#a00801'
            ]
        }
    },
    winds: {
        id: 'theme1',
        title: 'Theme 1',
        value: {
            stops: [
                0, 'rgba(0,0,0,0)',
                2.2, '#c8c1c3',
                4.5, '#ff99fd',
                8.9, '#4b00a1',
                9, '#31189e',
                11.2, '#00e2fc',
                15.65, '#01cb16',
                17.88, '#ffe104',
                20.12, '#ff6a00',
                22.35, '#c70f1c',
                26.82, '#b40c20'
            ]
        }
    },
    radar: {
        id: 'theme1',
        title: 'Theme 1',
        value: {
            stops: [
                0, 'rgba(0,0,0,0)',
                4.9, 'rgba(0,0,0,0)',
                5, '#00ecec',
                10, '#00a0f6',
                15, '#0000f6',
                20, '#00ff02',
                25, '#00c800',
                30, '#019001',
                35, '#ffff02',
                40, '#e7c000',
                45, '#ff9000',
                50, '#ff0000',
                55, '#dc0100',
                60, '#c00001',
                65, '#ff00ff',
                70, '#9955c9',
                75, '#ffffff'
            ]
        }
    }
};

export const THEME_2 = {
    temps: {
        id: 'theme2',
        title: 'Theme 2',
        value: {
            stops: [
                -80, '#25042a',
                -67, '#2a0b7f',
                -54, '#512728',
                -41, '#bd2592',
                -27, '#7e86b9',
                -17, '#44d2d5',
                0, '#1555b3',
                2, '#17830f',
                18, '#f5fa3b',
                38, '#de4427',
                55, '#581b42'
            ]
        }
    },
    winds: {
        id: 'theme2',
        title: 'Theme 2',
        value: {
            stops: [
                0, '#0000ff',
                9, '#00a7c0',
                18, '#15fd00',
                28, '#c79e00',
                36, '#fe0007',
                45, '#b402b4',
                100, '#ffffff'
            ]
        }
    }
};

export const THEME_3 = {
    temps: {
        id: 'theme3',
        title: 'Theme 3',
        value: {
            stops: [
                -73.33, '#3f1c91',
                -60, '#f30f82',
                -51, '#f38ec7',
                -35, '#99f5f5',
                -26, '#1b303c',
                -17.79, '#d2d2d2',
                -17.78, '#351e9c',
                -9, '#aa2c2c',
                -1, '#ffe6e6',
                4, '#8bcce4',
                10, '#4c548d',
                15.56, '#ffff78',
                21.11, '#fe9700',
                23.89, '#f76100',
                29.44, '#a41901',
                32.22, '#593a38',
                37.78, '#b38a86',
                46.11, '#732345',
                54.44, '#137540'
            ]
        }
    },
    winds: {
        id: 'theme3',
        title: 'Theme 3',
        value: {
            stops: [
                0, '#ffffff',
                7.99, '#646464',
                8, '#1464d2',
                14.99, '#b4f0fa',
                15, '#0ea00f',
                21.4, '#ffe877',
                26.82, '#ff6000',
                31.29, '#643c32',
                35.76, '#e1beb4',
                40.23, '#ffc8c8',
                44.7, '#e65e5e',
                49.17, '#d82f2e',
                53.64, '#b22c2c',
                59.12, '#a25b5a',
                64.82, '#7c7c7c'
            ]
        }
    }
};

export const THEME_4 = {
    radar: {
        id: 'theme4',
        title: 'Theme 4',
        value: {
            stops: [
                5, 'rgba(75,140,158,0)',
                19, '#4b8c9e',
                20, '#3f977c',
                27, '#10540b',
                32, '#f6fb08',
                39, '#b9a605',
                40, '#f68107',
                49, '#a1460e',
                50, '#f4000e',
                59, '#6d1b18',
                60, '#bd85a4',
                69, '#b2005f',
                70, '#8600d8',
                79, '#2e0079',
                80, '#76feff'
            ]
        }
    }
};

export const THEME_5 = {
    radar: {
        id: 'theme5',
        title: 'Theme 5',
        value: {
            stops: [
                0, 'rgba(0,0,0,0)',
                3, 'rgba(85,219,89,0)',
                6, '#55db59',
                30, '#024704',
                35, '#fae800',
                40, '#ea5f05',
                45, '#d20a06',
                50, '#810000',
                60, '#feffff',
                87, '#feffff'
            ]
        }
    }
};

export const THEME_6 = {
    temps: {
        id: 'theme6',
        title: 'Theme 6',
        value: {
            stops: [
                FtoC(-90), '#e9c5f7',
                FtoC(-50), '#f90c86',
                FtoC(-20), '#d276bf',
                FtoC(-10), '#6b41a7',
                FtoC(0), '#e4e7ff',
                FtoC(10), '#464ab5',
                FtoC(20), '#3375ed',
                FtoC(30), '#03f8f6',
                FtoC(32), '#6bea99',
                FtoC(45), '#19a00f',
                FtoC(60), '#fdff87',
                FtoC(80), '#cc2001',
                FtoC(90), '#901436',
                FtoC(100), '#e36f7e',
                FtoC(110), '#ffbcff',
                FtoC(120), '#b371c6',
                FtoC(130), '#8a0f5f'
            ]
        }
    }
};

export const THEME_7 = {
    radar: {
        id: 'theme7',
        title: 'Theme 7',
        value: {
            stops: [
                0, 'rgba(131, 182, 70, 0)',
                8, 'rgba(131, 182, 70, 0)',
                10, 'rgba(131, 182, 70, 1)',
                12, '#79CD46',
                20, '#60AD46',
                30, '#527846',
                35, '#FBDE46',
                40, '#F5AE4A',
                43, '#EF8353',
                47, '#C94D4B',
                52, '#954A58',
                57, '#E64BB3',
                62, '#AD56D1',
                70, '#D5C5CD',
                87, '#D5C5CD'
            ]
        }
    }
};

export const THEME_8 = {
    radar: {
        id: 'theme8',
        title: 'Theme 8',
        value: {
            masks: [{
                colorscale: {
                    stops: [
                        0, 'rgba(0,0,0,0)',
                        5.9, 'rgba(113,255,194,0)',
                        6, '#71ffc2',
                        10, '#49eb3a',
                        33, '#114c00',
                        40, '#e4c700',
                        50, '#da0000',
                        60, '#7a0009',
                        65, '#9e0570',
                        70, '#dc42b1',
                        80, '#dea8ff',
                        87, '#faf3ff'
                    ]
                }
            }, {
                colorscale: {
                    stops: [
                        0, 'rgba(0,0,0,0)',
                        5.9, 'rgba(248,178,205,0)',
                        6, '#E9AAC0',
                        25, '#E93D7A',
                        58, '#DB1E16',
                        87, '#58003c'
                    ]
                }
            }, {
                colorscale: {
                    stops: [
                        0, 'rgba(0,0,0,0)',
                        5.9, 'rgba(255,255,255,0)',
                        6, '#ffffff',
                        25, '#9B9BE5',
                        45, '#0000af',
                        58, '#535DFF',
                        87, '#373EA8'
                    ]
                }
            }]
        }
    }
};

export const HEATMAP = {
    default: {
        id: 'default',
        title: 'Default',
        value: {
            normalized: true,
            stops: [
                0, 'rgba(0, 0, 0, 0)',
                0.2, 'rgba(0, 0, 255, 0.2)',
                0.45, 'rgba(0, 255, 0, 0.5)',
                0.85, 'rgba(255, 255, 0, 1)',
                1, 'rgba(255, 0, 0, 1)'
            ]
        }
    },
    glow: {
        id: 'glow',
        title: 'Glow',
        value: {
            normalized: true,
            stops: [
                0, 'rgba(0, 0, 0, 0)',
                0.35, 'rgba(0, 0, 255, 0.3)',
                0.75, 'rgba(255, 0, 0, 0.8)',
                1, 'rgba(255, 255, 255, 0.8)'
            ]
        }
    }
};
