import { ValueAction } from '@/types/action/dispatch';
import { EVENT } from '@/constants/action';

export const stateReducer = (state: any, action: ValueAction) => {
    switch (action.type) {
        case EVENT.updateValue: {
            return { ...state, [action.payload.id]: action.payload.value };
        }
        default: {
            return state;
        }
    }
};
