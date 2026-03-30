import { BaseResponse } from './base.response';
import { HttpStatus } from '@nestjs/common';

export class SingleResponse extends BaseResponse {
    /**
     * Creates an API Message Response.
     * @param {object} data - Data Object.
     * @param {string} message - Response message.
     */
    constructor(data: object = {}, message = 'Success', status = HttpStatus.OK, result = 0, error = null) {
        super(data, message, status, result, error);
    }
}
