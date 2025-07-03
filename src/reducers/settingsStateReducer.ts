import { Reducer } from 'react';
import { SettingsContextProps } from '@/providers/SettingsProvider';
import { ValueAction } from '@/types/action/settings';
import { DEFAULT_UNITS } from '@/constants/units';
import { getUnitSystemSetting } from '@/utils/units';
import { isUnitSystem, isValidUnitsObject, isValidUnitForMeasurementType } from '@/utils/unitTypeGuards';
import { isColorScalesRecord } from '@/types/colors';
import { EVENT } from '@/constants/action';

/**
 * Reducer function to manage updates to the SettingsContextProps state.
 *
 * Handles updates for:
 * - Predefined settings like `unitSystem`, `units`, and `colorScales`.
 * - Custom settings provided by the user.
 *
 * @param state - The current state of settings.
 * @param action - The dispatched action containing the update details.
 * @returns The updated state after applying the action.
 */

export const settingsStateReducer: Reducer<SettingsContextProps, ValueAction<SettingsContextProps>> = (
    state,
    action
) => {
    switch (action.type) {
        case EVENT.updateValue: {
            // id and value come from generic ValueAction<SettingsContextProps>
            const { id, value } = action.payload;

            // `id` is keyof SettingsContextProps, which should be string due to the index signature.

            if (id === 'unitSystem') {
                const isValidUnitSystem = isUnitSystem(value);
                return {
                    ...state,
                    unitSystem: isValidUnitSystem ? value : 'custom',
                    ...(isValidUnitSystem ? { units: DEFAULT_UNITS[value] } : {})
                };
            }

            if (id === 'colorScales' && isColorScalesRecord(value)) {
                return {
                    ...state,
                    colorScales: {
                        ...state.colorScales,
                        ...value
                    }
                };
            }

            // Handle measurement type keys (e.g., 'temperature', 'speed') updating a single unit:
            if (isValidUnitForMeasurementType(id, value)) {
                const updatedUnits = {
                    ...state.units,
                    [id]: value
                };
                const newUnitSystem = getUnitSystemSetting(updatedUnits);
                return {
                    ...state,
                    units: updatedUnits,
                    unitSystem: newUnitSystem
                };
            }

            // Handle full `units` object updates, useful updating multiple units at once.
            if (id === 'units' && isValidUnitsObject(value)) {
                return {
                    ...state,
                    units: value,
                    unitSystem: getUnitSystemSetting(value)
                };
            }

            // Set custom settings
            return {
                ...state,
                [id]: value
            };
        }

        default: {
            return state;
        }
    }
};
