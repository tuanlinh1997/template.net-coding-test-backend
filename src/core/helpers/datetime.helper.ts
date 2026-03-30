import * as moment from 'moment';
import 'moment-timezone/builds/moment-timezone-with-data';
export const toScheduleDateTime = (dateTime) => moment(dateTime).seconds(0).utc().toISOString();

export const getCurrentDateTime = () => moment().format('DD-MM-YYYY HH:mm:ss');

export const formatDateTimeWithUTC = (dateTime) => moment(dateTime).utc().format('LLLL UTC');

export const formatDateToString = (format: string) => moment().format(format);

export const formatYesterdayToString = (format: string) => moment().subtract(1, 'days').format(format);

export const getAddMoreDayFromCurrentDateTime = (days: number, format: string) => moment().add(days, 'days').format(format);

export const addFromCurrentDateTime = (
    format: string,
    value,
    type = 'days', // type is days | hours | months | years | seconds | minutes
) => moment().add(type, value).format(format);

export const subtractFromCurrentDateTime = (
    format: string,
    value,
    type = 'days', // type is days | hours | months | years | seconds | minutes
) => moment().subtract(type, value).format(format);

export const formatDateTime = (format: string, dateTime = '') => {
    if (dateTime && dateTime !== '' && dateTime !== '0000-00-00 00:00:00') {
        return moment(dateTime).format(format);
    }
    return moment().format(format);
};

export const getTime = (dateTime = '') => {
    if (dateTime && dateTime !== '' && dateTime !== '0000-00-00 00:00:00') {
        return moment(dateTime).unix();
    }
    return moment().unix();
};

export const formatUnixDateTime = (timestamp, format: string) => {
    return moment.unix(timestamp).format(format);
};

export const getMTime = (dateTime = '') => {
    if (dateTime && dateTime !== '' && dateTime !== '0000-00-00 00:00:00') {
        return moment(dateTime).valueOf();
    }
    return moment().valueOf();
};

export const subFromDateTime = (date, format, value, type = 'days') =>
    // type is days | hours | months | years | seconds | minutes
    moment(date).subtract(type, value).format(format);
export const convertISOToString = (dateTime = '') => {
    const date = moment(dateTime);
    return date.format('YYYY-MM-DD HH:mm:ss').toString();
};
