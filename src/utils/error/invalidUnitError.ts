type UnitErrorConfig = {
    type: 'mixedUnits';
} | {
    type: 'invalidValue';
    unit: string;
    validUnits: string[];
};

export default class InvalidUnitError extends Error {
    constructor(config: UnitErrorConfig) {
        let message: string;
        switch (config.type) {
            case 'invalidValue': {
                message = `Invalid unit: ${config.unit}. Valid units are: ${config.validUnits?.join(', ')}`;
                break;
            }
            case 'mixedUnits': {
                message = 'All dimensions must have the same unit. Mixed units are not allowed.';
                break;
            }
            default: {
                message = 'Invalid unit.';
            }
        }
        super(message);
        this.name = 'InvalidUnitError';
    }
}
