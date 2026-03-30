import { Req } from '@nestjs/common';
import { Request } from 'express';

export class UrlHelper {
    constructor() {}

    // TODO: viet ham get current domain nối với prefix ex: url(prefix = '')
    getCurrentDomain(@Req() req: Request, regex: string = '') {
        if (regex != '') return `${req.protocol}://${req.get('Host')}/${regex}`;
        return `${req.protocol}://${req.get('Host')}${req.originalUrl}`;
    }
}
