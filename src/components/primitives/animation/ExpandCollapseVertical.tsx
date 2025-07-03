import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DYNAMIC_EASE } from '@/constants/animation';

export interface ExpandCollapseVerticalProps {
    children: ReactNode,
    expanded: boolean | null,
    className?: string,
    duration?: number,
    ease?: string | number[]
}

export const ExpandCollapseVertical = ({
    children,
    expanded = false,
    className = '',
    duration = 0.2,
    ease = DYNAMIC_EASE
}: ExpandCollapseVerticalProps) => (
    <AnimatePresence
        initial={false}
    >
        {expanded && (
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration, ease }}
            >
                <div className={className}>
                    {children}
                </div>
            </motion.div>
        )}
    </AnimatePresence>
);
