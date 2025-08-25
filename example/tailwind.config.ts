import type { Config } from 'tailwindcss'
import { THEME } from './src/constants/theme'

const config: Config = {
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: THEME.colors,
            spacing: {
                '11.5': '2.875rem',    // 46px
                '13': '3.25rem'        // 52px      
            },
            inset: {
                '13': '3.25rem'        // 52px
            },
            opacity: {
                '20': '.2'
            },
            width: {
                '10.5': '2.625rem',    // 42px
                '50': '12.5rem',        // 200px
                '65': '16.25rem',      // 260px
                '90': '22.5rem'        // 360px
            },
            height: {

                '10.5': '2.625rem',    // 42px
            },
            size: {
                '10.5': '2.625rem',   // 42px
            },
            borderWidth: {
                '3': '3px'
            },
            fontSize: {
                '2xs': '0.625rem'     // 10px
            },
            minWidth: {
                '65': '16.25rem'       // 260px
            },
            maxWidth: {
                '65': '16.25rem'       // 260px
            },
            zIndex: {
                'negative': '-1',
                '60': '60',
                '70': '70',
                '80': '80',
                '90': '90',
                '100': '100'
            }
        }
    },
    plugins: []
} satisfies Config

export default config