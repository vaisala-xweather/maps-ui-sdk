export default class HttpError extends Error {
    statusCode: number;
    body: any | undefined;

    constructor(statusCode: number, message: string, body?: any) {
        super(message);
        this.statusCode = statusCode;
        this.body = body;
        this.name = 'HttpError';
    }
}
