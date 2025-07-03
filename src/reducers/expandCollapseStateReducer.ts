import { ExpandCollapseAnimationState } from '@/types/animation';
import { EXPAND_COLLAPSE_ANIMATION_STATES } from '@/constants/animation';

export const expandCollapseStateReducer = (
    state: ExpandCollapseAnimationState,
    action: ExpandCollapseAnimationState
) => {
    const {
        expanded,
        collapseInitiated,
        collapsing,
        collapseInitiationComplete,
        collapsed,
        expandCollapseComplete,
        expandInitiated,
        expandInitiationComplete,
        expanding
    } = EXPAND_COLLAPSE_ANIMATION_STATES;

    switch (action) {
        case expandCollapseComplete: {
            return state === collapsing ? collapsed : expanded;
        }
        case collapseInitiated: {
            return collapseInitiated;
        }
        case collapseInitiationComplete: {
            return collapsing;
        }
        case expandInitiationComplete: {
            return expanding;
        }
        case expandInitiated: {
            return expandInitiated;
        }
        default: {
            return state;
        }
    }
};
