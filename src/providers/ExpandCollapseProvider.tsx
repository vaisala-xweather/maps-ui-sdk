import { ReactNode, createContext, useContext, useReducer, useRef } from 'react';
import { EXPAND_COLLAPSE_ANIMATION_STATES } from '@/constants/animation';
import { expandCollapseStateReducer } from '@/reducers/expandCollapseStateReducer';
import { ExpandCollapseAnimationState } from '@/types/animation';

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

export interface ExpandCollapseContextProps {
    animationState: ExpandCollapseAnimationState;
    isExpanded: boolean;
    isCollapsed: boolean;
    isAnimating: boolean;
    isExpanding: boolean;
    isCollapsing: boolean;
    isTransitioning: boolean;
    toggle: () => void;
    onAnimationComplete: () => void;
    setAnimationState: (newAnimationState: ExpandCollapseAnimationState) => void;
    animationStateMatches: (states: ExpandCollapseAnimationState[]) => boolean;
}

export const ExpandCollapseContext = createContext<ExpandCollapseContextProps>({
    animationState: expanded,
    isExpanded: true,
    isCollapsed: false,
    isAnimating: false,
    isExpanding: false,
    isCollapsing: false,
    isTransitioning: false,
    toggle: () => {},
    onAnimationComplete: () => {},
    setAnimationState: () => {},
    animationStateMatches: (states: ExpandCollapseAnimationState[]) => states.includes(expanded)
});

export const useExpandCollapseContext = () => {
    const context = useContext(ExpandCollapseContext);
    if (!context) {
        throw new Error('useExpandCollapseContext must be used within an ExpandCollapseProvider');
    }
    return context;
};

export interface ExpandCollapseProviderProps {
    children: ReactNode;
    initialState?: ExpandCollapseAnimationState;
}

export const ExpandCollapseProvider = ({
    children,
    initialState = expanded
}: ExpandCollapseProviderProps) => {
    const [animationState, dispatch] = useReducer(expandCollapseStateReducer, initialState);
    const isAnimatingRef = useRef(false);

    const animationStateMatches = (states: ExpandCollapseAnimationState[]) => states.includes(animationState);

    const handleDispatch = (newState: ExpandCollapseAnimationState) => {
        if (newState === collapseInitiationComplete || newState === expandInitiationComplete) {
            if (isAnimatingRef.current) {
                dispatch(newState);
            }
        } else {
            dispatch(newState);
        }
    };

    const toggle = () => {
        isAnimatingRef.current = true;
        if (animationState === expanded) {
            handleDispatch(collapseInitiated);
        } else {
            handleDispatch(expandInitiated);
        }
    };

    const handleAnimationComplete = () => {
        if (isAnimatingRef.current) {
            isAnimatingRef.current = false;
            handleDispatch(expandCollapseComplete);
        }
    };

    const isExpanded = animationState === expanded;
    const isCollapsed = animationState === collapsed;
    const isExpanding = animationStateMatches([expanding, collapseInitiated]);
    const isCollapsing = animationStateMatches([collapsing, expandInitiated]);
    const isTransitioning = animationStateMatches([expanding, collapsing, expandInitiated, collapseInitiated]);

    return (
        <ExpandCollapseContext.Provider
            value={{
                animationState,
                setAnimationState: handleDispatch,
                toggle,
                onAnimationComplete: handleAnimationComplete,
                isExpanded,
                isCollapsed,
                isAnimating: isAnimatingRef.current,
                isExpanding,
                isCollapsing,
                isTransitioning,
                animationStateMatches
            }}>
            {children}
        </ExpandCollapseContext.Provider>
    );
};
