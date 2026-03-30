import { HttpStatus } from '@nestjs/common';

export class BaseResponse {
    protected data: object;
    protected message: string;
    protected status: number;
    protected result: number;
    protected errors: object;
    /**
     * Creates an API Base.
     * @param {object} data - Data Object.
     * @param {string} message - Response message.
     * @param {number} status - HTTP status code.
     * @param {number} result - status code define.
     * @param {object} errors - Errors if any.
     */
    constructor(data: object = null, message = '', status: number = HttpStatus.OK, result = 0, errors = null) {
        this.data = data;
        this.message = message;
        this.status = status;
        this.result = result;
        this.errors = errors;
    }
}
