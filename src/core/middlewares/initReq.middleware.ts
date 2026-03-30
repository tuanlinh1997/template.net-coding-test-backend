import { isEmpty } from 'lodash';

export const initRequestMiddleware = (req, res, next) => {
    if (isEmpty(req.body)) {
        req.body = {};
    }
    next();
};
