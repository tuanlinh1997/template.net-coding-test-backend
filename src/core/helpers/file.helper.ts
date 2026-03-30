import * as fs from 'fs';
import * as path from 'path';
import { BadRequestException, HttpStatus } from '@nestjs/common';
import { LoggerService } from '../logger/logger.custom';
import { ErrorResponse } from './../helpers/responses/error.response';
import { responseMsg } from '../constants/responseMsg.const';

export class FileCache {
    protected path: string;
    protected extension: string;
    protected logger: LoggerService;

    constructor() {
        this.logger = new LoggerService();
        const root = `${process.cwd()}`;

        this.logger.log(root, 'root: ');
        this.logger.log('path-resolve: ', path.resolve('./'));
        this.path = path.resolve('./') + '/public/cache';
        this.extension = '.txt';
    }
    /**
     * set path.
     *
     * @param {string} folder
     *
     * @returns {string}
     */
    setPath = (folder: string): string => {
        try {
            if (folder) {
                if (folder.substring(0, 1) === '/') this.path = this.path + folder;
                else this.path = this.path + '/' + folder;
            }
            this.logger.log(this.path, 'this.path: ');
            return fs.mkdirSync(this.path, { recursive: true });
        } catch (error) {
            this.logger.error('cannot set path at: ', error.message, this.path);
            throw new BadRequestException(new ErrorResponse(error.message, responseMsg.FILE_ERROR.CODE, HttpStatus.BAD_REQUEST, error));
        }
    };

    /**
     * Check if a file exists at a given path.
     *
     * @param {string} path
     *
     * @returns {boolean}
     */
    checkIfFileOrDirectoryExists = (path: string): boolean => {
        return fs.existsSync(path);
    };

    /**
     * create new file.
     *
     * @param {string} path
     *
     * @returns {number | null}
     */
    createNewFile = (path: string): number | null => {
        try {
            return fs.openSync(path, 'w');
        } catch (error) {
            this.logger.warn('cannot create a file at: ', path);
            throw new BadRequestException(new ErrorResponse(error.message, responseMsg.FILE_ERROR.CODE, HttpStatus.BAD_REQUEST, error));
        }
    };

    /**
     * Writes a file at a given path via a promise interface.
     *
     * @param {string} key
     * @param {any} obj
     *
     * @return {Promise<void>}
     */
    saveJsonObjectToFile = (obj, key: string): Promise<void> => {
        const jsonString = JSON.stringify(obj);
        const filePath = this.path + '/' + key + this.extension;

        return new Promise((resolve) => {
            try {
                this.createNewFile(filePath);
                fs.writeFile(filePath, jsonString, 'utf-8', (err) => {
                    if (err) {
                        console.log('saveJsonObjectToFile.writeFile.error:', err);
                        resolve(null);
                    }
                    resolve(obj);
                });
            } catch (error) {
                this.logger.warn('saveJsonObjectToFile.error:', error.message);
                resolve(null);
            }
        });
    };

    /**
     * Gets file data from a given path via a promise interface.
     *
     * @param {string} key
     *
     * @returns {any | null}
     */
    getJsonObjectFromFile = (key: string): any | null => {
        const filePath = this.path + '/' + key + this.extension;
        try {
            const jsonString = fs.readFileSync(filePath, { encoding: 'utf8' });
            return JSON.parse(jsonString);
        } catch (error) {
            this.logger.warn('cannot read file at: ', filePath);
            throw new BadRequestException(new ErrorResponse(error.message, responseMsg.FILE_ERROR.CODE, HttpStatus.BAD_REQUEST, error));
        }
    };

    /**
     * Gets streaming file data from a given path.
     *
     * @param {string} key
     *
     * @returns {Promise<object>}
     */
    getJsonObjectFromFileStream = async (key: string): Promise<object> => {
        const filePath = this.path + '/' + key + this.extension;
        try {
            const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });
            let result = '';
            for await (const chunk of readStream) {
                result += chunk;
            }
            return JSON.parse(result);
        } catch (error) {
            this.logger.warn('cannot read file at: ', filePath);
            throw new BadRequestException(new ErrorResponse(error.message, responseMsg.FILE_ERROR.CODE, HttpStatus.BAD_REQUEST, error));
        }
    };

    /**
     * Gets file data from a given path via a promise interface.
     *
     * @param {string} key
     *
     * @returns {string}
     */
    readFileAsString = (key: string): string => {
        const filePath = this.path + '/' + key + this.extension;
        try {
            return fs.readFileSync(filePath, { encoding: 'utf8' });
        } catch (error) {
            this.logger.warn('cannot read file at: ', filePath);
            throw new BadRequestException(new ErrorResponse(error.message, responseMsg.FILE_ERROR.CODE, HttpStatus.BAD_REQUEST, error));
        }
    };

    /**
     * Writes a file at a given path via a promise interface.
     *
     * @param {string} key
     * @param {any} base64Uri
     *
     * @return {Promise<void>}
     */
    saveTmpBase64File = (key = '', base64Uri: any = ''): Promise<void> => {
        const filePath = this.path + '/' + key + this.extension;
        const base64data = base64Uri.split(';base64,').pop();
        return new Promise((resolve) => {
            try {
                this.createNewFile(filePath);
                fs.writeFile(filePath, base64data, 'base64', (err) => {
                    if (err) {
                        console.log('saveTmpBase64File.writeFile.error:', err);
                        resolve(null);
                    }
                    resolve(base64data);
                });
            } catch (error) {
                this.logger.warn('saveTmpBase64File.error:', error.message);
                resolve(null);
            }
        });
    };

    /**
     * Delete folder cache at the given path via a promise interface
     *
     * @returns {void}
     */
    removeFolder = (): void => {
        try {
            if (fs.existsSync(this.path)) {
                fs.rmdirSync(this.path, { recursive: true });
                this.logger.warn('removed folder at: ', this.path);
            }
        } catch (error) {
            this.logger.warn('cannot remove folder at: ', error.message);
            throw new BadRequestException(new ErrorResponse(error.message, responseMsg.FILE_ERROR.CODE, HttpStatus.BAD_REQUEST, error));
        }
    };

    /**
     * Delete file at the given path via a promise interface
     *
     * @param {string} filePath
     *
     * @returns {void}
     */
    deleteFile = (filePath: string): void => {
        try {
            return fs.unlinkSync(filePath);
        } catch (error) {
            this.logger.warn('deleteFile.error: ', error.message);
            throw new BadRequestException(new ErrorResponse(error.message, responseMsg.FILE_ERROR.CODE, HttpStatus.BAD_REQUEST, error));
        }
    };

    /**
     * Gets file data from a given path via a promise interface.
     *
     * @param {string} key
     * @param {string} folder
     * @param {string} ext
     *
     * @returns {string}
     */
    readFileAsStringV2 = (key: string, folder = '', ext = '.txt'): string => {
        this.path = path.resolve('./') + '/public';
        let filePath = this.path + '/';
        if (folder !== '') filePath = filePath + folder + '/';
        filePath = filePath + key + ext;
        try {
            return fs.readFileSync(filePath, { encoding: 'utf8' });
        } catch (error) {
            this.logger.warn('cannot read file at: ', filePath);
            throw new BadRequestException(new ErrorResponse(error.message, responseMsg.FILE_ERROR.CODE, HttpStatus.BAD_REQUEST, error));
        }
    };
}
