import { CSSProperties } from 'react';
import { AnchorValue } from '@/types/anchor';
import { ANCHOR } from '@/constants/anchor';

export interface CSSPropertiesWithOffsets extends CSSProperties {
    '--offset-x': string;
    '--offset-y': string;
}

export const getAnchorStyle = (anchor: AnchorValue, offsetX: number, offsetY: number): CSSProperties => {
    const baseStyle: CSSPropertiesWithOffsets = {
        'position': 'absolute',
        '--offset-x': `${offsetX}px`,
        '--offset-y': `${offsetY}px`
    };

    switch (anchor) {
        case ANCHOR.topLeft: {
            return {
                ...baseStyle,
                top: 'var(--offset-y)',
                left: 'var(--offset-x)'
            };
        }
        case ANCHOR.topRight: {
            return {
                ...baseStyle,
                top: 'var(--offset-y)',
                right: 'var(--offset-x)'
            };
        }
        case ANCHOR.bottomLeft: {
            return {
                ...baseStyle,
                bottom: 'var(--offset-y)',
                left: 'var(--offset-x)'
            };
        }
        case ANCHOR.bottomRight: {
            return {
                ...baseStyle,
                bottom: 'var(--offset-y)',
                right: 'var(--offset-x)'
            };
        }
        case ANCHOR.top: {
            return {
                ...baseStyle,
                top: 'var(--offset-y)',
                left: 'var(--offset-x)',
                right: 'var(--offset-x)',
                width: 'calc(100% - 2 * var(--offset-x))'
            };
        }
        case ANCHOR.bottom: {
            return {
                ...baseStyle,
                bottom: 'var(--offset-y)',
                left: 'var(--offset-x)',
                right: 'var(--offset-x)',
                width: 'calc(100% - 2 * var(--offset-x))'
            };
        }
        case ANCHOR.left: {
            return {
                ...baseStyle,
                left: 'var(--offset-x)',
                top: 'var(--offset-y)',
                bottom: 'var(--offset-y)',
                height: 'calc(100% - 2 * var(--offset-y))'
            };
        }
        case ANCHOR.right: {
            return {
                ...baseStyle,
                right: 'var(--offset-x)',
                top: 'var(--offset-y)',
                bottom: 'var(--offset-y)',
                height: 'calc(100% - 2 * var(--offset-y))'
            };
        }
        case ANCHOR.center: {
            return {
                ...baseStyle,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            };
        }
        case ANCHOR.centerTop: {
            return {
                ...baseStyle,
                top: 'var(--offset-y)',
                left: '50%',
                transform: 'translateX(-50%)'
            };
        }
        case ANCHOR.centerBottom: {
            return {
                ...baseStyle,
                bottom: 'var(--offset-y)',
                left: '50%',
                transform: 'translateX(-50%)'
            };
        }
        case ANCHOR.centerLeft: {
            return {
                ...baseStyle,
                left: 'var(--offset-x)',
                top: '50%',
                transform: 'translateY(-50%)'
            };
        }
        case ANCHOR.centerRight: {
            return {
                ...baseStyle,
                right: 'var(--offset-x)',
                top: '50%',
                transform: 'translateY(-50%)'
            };
        }
        default: {
            console.warn(`Unsupported anchor value: ${anchor}`);
            return baseStyle;
        }
    }
};
