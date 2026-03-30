import axios, { AxiosRequestConfig } from 'axios';
// import * as https from 'https';
import * as qs from 'qs';

export const baseApi = async (
    method: string,
    url: string,
    token = null,
    params = null,
    cookie = null,
    type = 'form',
    timeout = 5000,
    headers = null,
) => {
    // contentType: form or json
    try {
        // const httpsAgent = new https.Agent({ minVersion: "TLSv1.2", maxVersion: "TLSv1.3" });

        let contentType = 'application/x-www-form-urlencoded';
        if (type === 'json') {
            contentType = 'application/json';
            // application/json; charset=utf-8
        }
        const options: AxiosRequestConfig = {
            method: method,
            headers: { 'content-type': contentType, Cookie: cookie, 'Set-Cookie': cookie },
            url: url,
            timeout: timeout, // Wait for ms
            // httpsAgent,
        };
        if (params) {
            // console.log('paramSMS',params);
            options.data = qs.stringify(params);
            if (type === 'json') {
                options.data = params;
            }
        }
        if (token) {
            options.headers = { 'content-type': contentType, Authorization: 'Bearer ' + token, Cookie: cookie, 'Set-Cookie': cookie };
        }
        if (headers) {
            options.headers = { ...headers, ...options.headers };
        }
        const res = await axios(options);
        if (res.headers['set-cookie']) {
            res.data.cookie = res.headers['set-cookie'][0];
        }
        return res.data || null;
    } catch (error) {
        console.log('url: ', url);
        console.log(error);
        // console.log('baseApi.error: ', error.message);
        // console.log('baseApi.error res: ', error.response);
        // console.log(error)
    }
    return null;
};

export const baseApiV2 = async (method: string, url: string, token = null, params = null, cookie = null, type = 'form', timeout = 5000) => {
    // contentType: form or json
    try {
        // const httpsAgent = new https.Agent({ minVersion: "TLSv1.2", maxVersion: "TLSv1.3" });

        let contentType = 'application/x-www-form-urlencoded';
        if (type === 'json') {
            contentType = 'application/json';
            // application/json; charset=utf-8
        }
        const options: AxiosRequestConfig = {
            method: method,
            headers: { 'content-type': contentType, Cookie: cookie, 'Set-Cookie': cookie },
            url: url,
            timeout: timeout, // Wait for ms
            // httpsAgent,
        };
        if (params && method.toUpperCase() === 'GET') {
            const queryStringParams = qs.stringify(params);
            console.log('queryStringParams', queryStringParams);

            options.url += `?${queryStringParams}`;
            console.log('options.url', options.url);
        }
        if (params) {
            // console.log('paramSMS',params);
            options.data = qs.stringify(params);
            if (type === 'json') {
                options.data = params;
            }
        }
        if (token) {
            options.headers = { 'content-type': contentType, Authorization: token, Cookie: cookie, 'Set-Cookie': cookie };
        }

        const res = await axios(options);
        if (res.headers['set-cookie']) {
            res.data.cookie = res.headers['set-cookie'][0];
        }
        return res.data || null;
    } catch (error) {
        console.log('url: ', url);
        console.log('baseApi.error: ', error.message);
        console.log('baseApi.error res: ', error.response);
    }
    return null;
};
