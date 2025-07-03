import { forwardRef } from 'react';
import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion';
import { DYNAMIC_EASE } from '@/constants/animation';

export interface FadeProps extends HTMLMotionProps<'div'> {
    duration?: number;
    delay?: number;
    ease?: number[];
}

const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
};

export const Fade = forwardRef<HTMLDivElement, FadeProps>(({
    children,
    onAnimationComplete,
    initial = { opacity: 0 },
    duration = 0.2,
    delay = 0,
    ease = DYNAMIC_EASE,
    transition,
    animate = 'visible',
    ...rest
}, ref) => (
    <motion.div
        ref={ref}
        initial="hidden"
        animate={animate}
        exit="exit"
        variants={variants}
        transition={{ delay, duration, ease, ...transition }}
        onAnimationComplete={onAnimationComplete}
        {...rest}
    >
        {children}
    </motion.div>
));

Fade.displayName = 'Fade';

export interface FadePresenceProps extends FadeProps {
    isPresent?: boolean;
}

export const FadePresence = forwardRef<HTMLDivElement, FadePresenceProps>(({
    children,
    isPresent,
    ...props
}, ref) => (
    <AnimatePresence mode="wait">
        {isPresent && (
            <Fade ref={ref} {...props}>
                {children}
            </Fade>
        )}
    </AnimatePresence>
));

FadePresence.displayName = 'FadePresence';
