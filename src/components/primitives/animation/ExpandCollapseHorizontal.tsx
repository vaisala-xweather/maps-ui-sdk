import { ReactNode, CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { pixels } from '@/utils/css';
import { useExpandCollapseContext } from '@/providers/ExpandCollapseProvider';
import { DYNAMIC_EASE, EXPAND_COLLAPSE_ANIMATION_STATES } from '@/constants/animation';

export interface ExpandCollapseHorizontalProps {
    children: ReactNode;
    expanded?: boolean;
    className?: string;
    expandedWidth?: number | string;
    collapsedWidth?: number | string;
    duration?: number;
    style?: CSSProperties;
    onAnimationComplete?: () => void;
}

export const ExpandCollapseHorizontal = ({
    children,
    expanded = false,
    onAnimationComplete,
    className,
    expandedWidth = '100%',
    collapsedWidth = 0,
    duration = 0.3,
    style = { position: 'absolute', left: 0, right: 0, bottom: 0 }
}: ExpandCollapseHorizontalProps) => {
    const { onAnimationComplete: contextOnAnimationComplete } = useExpandCollapseContext();
    const { expanded: expandedState } = EXPAND_COLLAPSE_ANIMATION_STATES;

    const effectiveExpandedWidth = typeof expandedWidth === 'number' ? pixels(expandedWidth) : expandedWidth;
    const effectiveCollapsedWidth = typeof collapsedWidth === 'number' ? pixels(collapsedWidth) : collapsedWidth;
    const effectiveExpanded = expanded ?? expandedState ?? false;

    const handleAnimationComplete = () => {
        contextOnAnimationComplete?.();
        onAnimationComplete?.();
    };

    return (
        <motion.div
            initial={false}
            style={{
                margin: '0 auto',
                ...style
            }}
            className={className}
            animate={{
                width: effectiveExpanded ? effectiveExpandedWidth : effectiveCollapsedWidth,
                x: effectiveExpanded ? 0 : 'auto'
            }}
            transition={{
                duration,
                ease: DYNAMIC_EASE
            }}
            onAnimationComplete={handleAnimationComplete}
        >
            {children}
        </motion.div>
    );
};
