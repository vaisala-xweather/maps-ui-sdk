import { EXPAND_COLLAPSE_ANIMATION_STATES } from '@/constants/animation';

export type ExpandCollapseAnimationState = (
    typeof EXPAND_COLLAPSE_ANIMATION_STATES[keyof typeof EXPAND_COLLAPSE_ANIMATION_STATES]
);

export type ExpandCollapseAnimationStates = {
    [K in keyof typeof EXPAND_COLLAPSE_ANIMATION_STATES]: ExpandCollapseAnimationState;
};
