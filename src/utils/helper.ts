import * as path from 'path';
import * as fs from 'fs';
import { formatDateToString } from '../core/helpers/datetime.helper';
import * as moment from 'moment';

import { baseApi } from '../core/helpers/api.helper';
import { removeVietnameseTones } from '../core/helpers/string.helper';
import { config } from '../config/config';
import { isEmpty, isNull } from 'lodash';

export const synCDN = async (
    file_path = '',
    title = '',
    username = '',
    service_type = 'content',
    sync_nodes = '',
    vod_id = '',
    partition = 1,
    isWriteLog = false,
    folderLog = '',
    isVod = false,
    platform = 'mytv',
    provider_id = 'HTV',
    quality = 0,
    series_id = 0,
) => {
    if (title === '') title = encodeURIComponent(file_path).replace(/%20/g, '+');
    // let sUrl = 'http://ctl.mytvnet.vn/syncv.vs';
    let sUrl = 'http://ctl.vmp.tv/syncv.vs';
    sUrl = sUrl + '?provider_id=' + provider_id;
    sUrl = sUrl + '&service_type=' + service_type;
    sUrl = sUrl + '&sync_nodes=' + sync_nodes;
    sUrl = sUrl + '&vod_id=' + vod_id;
    sUrl = sUrl + '&platform=' + platform;
    sUrl = sUrl + '&partition=' + partition;
    sUrl = sUrl + '&title=' + encodeURIComponent(title);
    sUrl = sUrl + '&quality=' + quality;
    if (config().env === 'staging') sUrl = sUrl + '&env=56';
    // if (config().env === 'pilot') sUrl = sUrl + '&env=';
    // if (config().env === 'production') sUrl = sUrl + '&env=';
    if (series_id !== 0) sUrl = sUrl + '&series_id=' + series_id;
    sUrl = sUrl + '&username=' + username;
    if (isVod) sUrl = sUrl + '&vod_path=' + encodeURIComponent(file_path).replace(/%20/g, '+');
    else sUrl = sUrl + '&limg_path=' + file_path;
    // sUrl = sUrl + '&title=' + encodeURIComponent(file_path);
    console.log('sUrl CDN: ' + sUrl);
    const apiHelper = await baseApi('get', sUrl);
    console.log('🚀 ~ file: helper.ts:42 ~ apiHelper:', apiHelper);

    if (isWriteLog) {
        const currentDate = new Date();

        const pathLog = path.resolve(
            `./public/logs/logCDN/${folderLog}/${currentDate.getFullYear()}/${currentDate.getMonth()}/${currentDate.getDate()}`,
        );
        if (!fs.existsSync(pathLog)) {
            // Nếu thư mục không tồn tại, tạo mới nó
            fs.mkdirSync(pathLog, { recursive: true });
        }
        const accessLogStream = fs.createWriteStream(path.join(pathLog, `logCdn.log`), { flags: 'a' });
        const logData =
            `[${formatDateToString('YYYY-MM-DD HH:mm:ss')}] REQUEST: ${sUrl}\n` +
            `[${formatDateToString('YYYY-MM-DD HH:mm:ss')}] RESPONE: ${JSON.stringify(apiHelper)} \n`;

        accessLogStream.write(logData);
    }
    return apiHelper;
};

export const synCDNImages = async (arr_file: any[], user: any) => {
    const arrResult = [];
    for (let index = 0; index < arr_file.length; index++) {
        const result = await synCDN(arr_file[index].image_url, arr_file[index].filename, user?.username);
        arrResult.push(result);
    }
    return arrResult;
};

/**
 * Convert to upper case, not lower case
 * @param obj is a value to convert
 * @param param1 is optional configuration
 * @returns object
 */
export const upperCaseLowercaseKeys = (obj: object, { isLowercase = true }) => {
    try {
        if (!obj) {
            return;
        }
        return Object.keys(obj).reduce((accumulator, key) => {
            const _key = isLowercase ? key.toLowerCase() : key.toUpperCase();
            accumulator[_key] = obj[key];
            return accumulator;
        }, {});
    } catch (err) {
        console.log('utils helper upperCaseLowercaseKeys err: ', err.message);
    }
};

// export const splitTag = (schedule: ScheduleEntity | ScheduleFromWebsiteEntity) => {
//     if (schedule.SCHEDULE_TAG && !isEmptyString(schedule.SCHEDULE_TAG)) {
//         let arrTag = [];
//         if (schedule.SCHEDULE_TAG.includes('\r\n')) arrTag = schedule.SCHEDULE_TAG.split('\r\n');
//         else arrTag = schedule.SCHEDULE_TAG.split('\n');
//         arrTag = arrTag.map((e) => {
//             if (e.length === 0) return '_BLANK_';
//             return e;
//         });
//         schedule.SCHEDULE_TAG = arrTag.join('\n');
//     } else {
//         schedule.SCHEDULE_TAG = '_BLANK_';
//     }
//     if (schedule.SCHEDULE_CONTENT) {
//         schedule.SCHEDULE_CONTENT = schedule.SCHEDULE_CONTENT.replace(/\r\n/g, '\n');
//     }
// };
export const hasDuplicate = (arr) => {
    const uniqueArr = [...new Set(arr)];
    return arr.length !== uniqueArr.length;
};

export const convertKeyword = (str: string) => {
    let sResult = '';
    if (str !== '') {
        sResult = removeVietnameseTones(str);

        const aWord = sResult.split(' ');
        let sFirstLetter = '';
        aWord.forEach((item) => {
            sFirstLetter += item.substring(0, 1);
        });
        sResult = sResult + ' ' + sFirstLetter;
    }

    return sResult;
};
export const noSignLower = (strText: string) => {
    strText = strText.trim().toLowerCase();

    const charUnicode = [
        /ạ|á|à|ả|ã|â|ậ|ấ|ầ|ẩ|ẫ|ă|ặ|ắ|ằ|ẳ|ẫ/gi,
        /ê|ẹ|é|è|ẻ|ẽ|ế|ề|ể|ễ|ệ/gi,
        /ọ|ộ|ổ|ỗ|ố|ồ|ô|ó|ò|ỏ|õ|ơ|ợ|ớ|ờ|ở|ỡ/gi,
        /ụ|ư|ứ|ừ|ử|ữ|ự|ú|ù|ủ|ũ/gi,
        /ị|í|ì|ỉ|ĩ/gi,
        /ỵ|ý|ỳ|ỷ|ỹ/gi,
        /đ/gi,
        /[^a-zA-Z0-9\s]/gi,
    ];

    const charEN = ['a', 'e', 'o', 'u', 'i', 'y', 'd', ''];

    for (let i = 0; i < charUnicode.length; i++) {
        strText = strText.replace(charUnicode[i], charEN[i]);
    }

    strText = strText.replace(/  /g, ' ');

    return strText;
};

export function changeDataContent(aParam, user) {
    const aDataInsert: any = {};

    if (aParam.CONTENT_ID !== undefined) aDataInsert.CONTENT_ID = aParam.CONTENT_ID;
    if (aParam.CONTENT_KEYWORD !== undefined) aDataInsert.CONTENT_KEYWORD = aParam.CONTENT_KEYWORD;
    if (aParam.VIDEO_KEYWORD !== undefined) aDataInsert.CONTENT_KEYWORD = aParam.VIDEO_KEYWORD;
    if (aParam.CONTENT_VER_POSTER !== undefined) aDataInsert.CONTENT_VER_POSTER = aParam.CONTENT_VER_POSTER;
    if (aParam.CONTENT_HOR_POSTER !== undefined) aDataInsert.CONTENT_HOR_POSTER = aParam.CONTENT_HOR_POSTER;
    if (aParam.VIDEO_POSTER !== undefined) {
        aDataInsert.CONTENT_VER_POSTER = aParam.VIDEO_POSTER;
        aDataInsert.CONTENT_HOR_POSTER = aParam.VIDEO_POSTER;
    }
    if (aParam.CONTENT_DIRECTOR !== undefined) aDataInsert.CONTENT_DIRECTOR = aParam.CONTENT_DIRECTOR;
    if (aParam.CONTENT_COMPANY !== undefined) aDataInsert.CONTENT_COMPANY = aParam.CONTENT_COMPANY;
    if (aParam.CONTENT_ACTOR !== undefined) aDataInsert.CONTENT_ACTOR = aParam.CONTENT_ACTOR;
    if (aParam.CONTENT_COUNTRY !== undefined) aDataInsert.CONTENT_COUNTRY = aParam.CONTENT_COUNTRY;
    if (aParam.CONTENT_PUBLISH_YEAR !== undefined) aDataInsert.CONTENT_PUBLISH_YEAR = aParam.CONTENT_PUBLISH_YEAR;
    if (aParam.CONTENT_MOVIE !== undefined) aDataInsert.CONTENT_MOVIE = aParam.CONTENT_MOVIE;
    if (aParam.CREATEDATE !== undefined) aDataInsert.CREATEDATE = aParam.CREATEDATE;
    if (aParam.CONTENT_STATUS !== undefined) aDataInsert.CONTENT_STATUS = aParam.CONTENT_STATUS;
    if (aParam.REASON_DISABLE !== undefined) aDataInsert.REASON_DISABLE = aParam.REASON_DISABLE;
    if (aParam.TYPE_ID !== undefined) aDataInsert.TYPE_ID = aParam.TYPE_ID;
    if (aParam.CONTENT_SINGLE !== undefined) aDataInsert.CONTENT_SINGLE = aParam.CONTENT_SINGLE;
    if (aParam.CONTENT_HOT !== undefined) aDataInsert.CONTENT_HOT = aParam.CONTENT_HOT;
    if (aParam.SERVICE_ID !== undefined) aDataInsert.SERVICE_ID = aParam.SERVICE_ID;
    if (aParam.SYN_CDN !== undefined) aDataInsert.SYN_CDN = aParam.SYN_CDN;
    if (aParam.CONTENT_QUALITY !== undefined) aDataInsert.CONTENT_QUALITY = aParam.CONTENT_QUALITY;
    if (aParam.PROVIDER_ID !== undefined) aDataInsert.PROVIDER_ID = aParam.PROVIDER_ID;
    if (aParam.PRODUCT_ID !== undefined) aDataInsert.PRODUCT_ID = aParam.PRODUCT_ID;
    if (aParam.PRODUCT_PLUGIN_ID !== undefined) aDataInsert.PRODUCT_PLUGIN_ID = aParam.PRODUCT_PLUGIN_ID;
    if (aParam.HIDDEN_DEVICE_LIST !== undefined) aDataInsert.HIDDEN_DEVICE_LIST = aParam.HIDDEN_DEVICE_LIST;
    if (aParam.MUSIC_VIDEO_ID !== undefined) aDataInsert.MUSIC_VIDEO_ID = aParam.MUSIC_VIDEO_ID;
    if (aParam.ARTIST_ID !== undefined) aDataInsert.ARTIST_ID = aParam.ARTIST_ID;
    if (aParam.ARTIST_NAME !== undefined) aDataInsert.ARTIST_NAME = aParam.ARTIST_NAME;
    if (aParam.CONTENT_AGE !== undefined) aDataInsert.CONTENT_AGE = aParam.CONTENT_AGE;
    if (aParam.LOCKED_LEVEL !== undefined) aDataInsert.LOCKED_LEVEL = aParam.LOCKED_LEVEL;
    if (aParam.WARNING !== undefined) aDataInsert.WARNING = aParam.WARNING;

    aDataInsert.USER_ID = user.id;
    aDataInsert.USER_NAME = user.username;
    aDataInsert.MODIFYDATE = moment().format('YYYY-MM-DD hh:mm:ss');

    return aDataInsert;
}

export function saveLogFile(data: any, folder = '', filename_input = '') {
    try {
        let pathLog = path.resolve(`.`);
        if (folder !== '') {
            pathLog = pathLog + folder;
        }
        if (filename_input === '') {
            filename_input = `${formatDateToString('YYYY-MM-DD')}.txt`;
        } else {
            filename_input = `${filename_input}.txt`;
        }
        if (!fs.existsSync(pathLog)) {
            // Nếu thư mục không tồn tại, tạo mới nó
            fs.mkdirSync(pathLog, { recursive: true });
        }
        const accessLogStream = fs.createWriteStream(path.join(pathLog, `logCdn.log`), { flags: 'a' });
        const logData = `[time: ${formatDateToString('YYYY-MM-DD HH:mm:ss')},data: ${JSON.stringify(data)}] \n`;

        accessLogStream.write(logData);
    } catch (error) {}
}

export function convertSecondsToHoursMinutesSeconds(seconds) {
    const duration = moment.duration(seconds, 'seconds');

    const hours = Math.floor(duration.asHours());
    const minutes = Math.floor(duration.minutes());
    const remainingSeconds = Math.floor(duration.seconds());

    return { hours, minutes, seconds: remainingSeconds };
}

export function removeFile(_tempFileName: string) {
    //Xoa file
    const fs = require('fs');
    fs.unlink(_tempFileName, (err) => {
        if (err) {
            console.error(err);
            return;
        }
    });
}

export function getNow() {
    return moment().format('YYYY-MM-DD HH:mm:ss');
}

//Get tham so
export function getParam(object: object, field: string, type: string = 'string') {
    if (type == 'number') {
        return object[field] == undefined ? 0 : isNull(object[field]) || object[field] == '' ? 0 : parseInt(object[field]);
    } else if (type == 'string') {
        return object[field] == undefined ? '' : isNull(object[field]) || object[field] == '' ? '' : object[field];
    }
}

export function convertStringToDate(data = '', format = 'YYYY-MM-DD') {
    return moment(data, 'DD-MM-YYYY HH:mm:ii').format(format);
}

export function convertStringToTime(data = '', format = 'HH:mm:ss') {
    return moment(data, 'HH:mm').format(format);
}

export function formatDate(date) {
    const padZero = (num) => (num < 10 ? '0' + num : num);
    const year = date.getFullYear();
    const month = padZero(date.getMonth() + 1);
    const day = padZero(date.getDate());
    const hour = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    const seconds = padZero(date.getSeconds());

    return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
}

export const formatDateForFile = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${day}-${month}-${year}`;
};

export function getParamWithDefaultValue(object: object, field: string, default_value = '', type: string = 'string') {
    if (type == 'number') {
        return object[field] == undefined ? parseInt(default_value) : object[field] == null ? 0 : parseInt(object[field]);
    } else if (type == 'string') {
        return object[field] == undefined ? default_value : object[field] == null || isEmpty(object[field]) ? '' : object[field];
    }
}

export function convertToDataTimeMySQL(date) {
    return date.toISOString().substring(0, 10) + ' ' + date.toISOString().substring(11, 19);
}

export function isManager(level: number) {
    if (level == 2 || level == 3) return true;
    return false;
}

export function isAdmin(level: number) {
    if (level == 3) return true;
    return false;
}
