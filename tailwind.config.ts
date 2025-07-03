import type { Config } from 'tailwindcss'
import { THEME } from './src/constants/theme'

const config: Config = {
    prefix: 'xw-',
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: THEME.colors,
            boxShadow: {
                'md': '0 2px 12px rgba(0, 0, 0, 0.25)',
            },
            spacing: {
                '11.5': '2.875rem',  // 46px
                '13': '3.25rem'      // 52px 
            },
            inset: {
                '13': '3.25rem'      // 52px
            },
            opacity: {
                '20': '.2'
            },
            width: {
                '6.5': '1.625rem',   // 26px
                '8': '2rem',         // 32px
                '65': '16.25rem',    // 260px
            },
            borderWidth: {
                '3': '3px'
            },
            fontSize: {
                '2xs': '0.625rem'    // 10px
            },
            minWidth: {
                '6.5': '1.625rem',   // 26px
                '10': '2.5rem',      // 40px
                '22': '5.5rem',      // 88px
                '65': '16.25rem'     // 260px
            },
            maxWidth: {
                '65': '16.25rem'     // 260px
            },
            minHeight: {
                '8': '2rem',
                '10': '2.5rem',
            },
            zIndex: {
                '60': '60',
                '70': '70',
                '80': '80',
                '90': '90',
                '100': '100',
                'negative': '-1'
            }
        }
    },
    plugins: [],
} satisfies Config

export default config