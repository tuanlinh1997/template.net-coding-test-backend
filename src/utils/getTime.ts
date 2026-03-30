export const getTimeNow = () => {
    const moment = require('moment-timezone');
    moment.tz.setDefault('Asia/Ho_Chi_Minh');
    return moment().format('YYYY-MM-DD HH:mm:ss');
};
