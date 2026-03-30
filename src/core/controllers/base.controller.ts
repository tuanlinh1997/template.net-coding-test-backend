import { HttpStatus } from '@nestjs/common';
import { ErrorResponse } from './../helpers/responses/error.response';
import { SingleResponse } from './../helpers/responses/single.response';

export class BaseController {
    /**
     * sendOkResponse.
     * @param {object} data - Data Object.
     * @param {string} message - Response message.
     * @param {number} status - status code define.
     * @param {number} result - status code define.
     * @param {object} errors - Errors if any.
     */
    sendOkResponse = (data: object = [], message = 'success', status: number = HttpStatus.OK, result = 0, error = null): object => {
        return new SingleResponse(data, message, status, result, error);
    };

    /**
     * sendOkResponse.
     * @param {object} data - Data Object.
     * @param {string} message - Response message.
     * @param {number} status - status code define.
     * @param {number} result - status code define.
     * @param {object} errors - Errors if any.
     */
    sendFailedResponse = (message = 'error', status: number = HttpStatus.BAD_REQUEST, result = -1, error = null, data: object = []): object => {
        return new ErrorResponse(message, result, status, error, data);
    };
}
