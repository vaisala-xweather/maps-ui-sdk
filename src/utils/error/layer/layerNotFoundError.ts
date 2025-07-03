export default class LayerNotFoundError extends Error {
    constructor(layerId: string) {
        super(`No layer found with ID: ${layerId}`);
        this.name = 'LayerNotFoundError';
    }
}
