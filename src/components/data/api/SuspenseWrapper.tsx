import { Suspense, ReactNode, ReactElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DYNAMIC_EASE } from '@/constants/animation';

export interface SuspenseWrapperProps {
  children: ReactNode;
  fallback: ReactElement;
}

const transitionVariants = {
    initial: { opacity: 0, y: 5 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -5 }
};

export const SuspenseWrapper = ({ children, fallback }: SuspenseWrapperProps) => (
    <Suspense fallback={fallback}>
        <AnimatePresence mode="wait">
            {children ? (
                <motion.div
                    key="content"
                    layout
                    variants={transitionVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3, ease: DYNAMIC_EASE }}
                >
                    {children}
                </motion.div>
            ) : (
                <motion.div
                    key="loader"
                    layout
                    variants={transitionVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3, ease: DYNAMIC_EASE }}
                >
                    {fallback}
                </motion.div>
            )}
        </AnimatePresence>
    </Suspense>
);
