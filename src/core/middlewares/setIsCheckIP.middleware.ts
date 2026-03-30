const { includes } = require('lodash');
export const setIsCheckIP = (req, res, next) => {
    if (includes(req.originalUrl, 'play') || includes(req.originalUrl, 'timeshift')) {
        req.query.is_check_ip = 1;
    }
    return next();
};
