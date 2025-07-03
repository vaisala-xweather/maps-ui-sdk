export default class InvalidDimensionError extends Error {
    constructor(dimension: string | number) {
        super(`Invalid dimension format: ${dimension}`);
        this.name = 'InvalidDimensionError';
    }
}
