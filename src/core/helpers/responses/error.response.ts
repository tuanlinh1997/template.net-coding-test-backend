import { BaseResponse } from './base.response';
import { HttpStatus } from '@nestjs/common';

export class ErrorResponse extends BaseResponse {
    /**
     * Creates an API Message Response.
     * @param {number} status - HTTP status code.
     * @param {object} errors - Error messages.
     * @param {number} result - Result error code define.
     * @param {string} message - Error descriptive message.
     */
    constructor(message = 'Bad request!', result = HttpStatus.BAD_REQUEST, status = HttpStatus.BAD_REQUEST, errors = {}, data: object = null) {
        super(data, message, status, result, errors);
    }
}
