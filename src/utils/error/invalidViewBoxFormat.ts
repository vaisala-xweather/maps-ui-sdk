export default class InvalidViewBoxFormatError extends Error {
    constructor(viewBox: string) {
        super(`Invalid viewBox format: ${viewBox}`);
        this.name = 'InvalidViewBoxFormatError';
    }
}
