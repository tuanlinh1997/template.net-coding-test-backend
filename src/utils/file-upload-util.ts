import { HttpException, HttpStatus } from '@nestjs/common';
import type { FileFilterCallback } from 'multer';
import { extname } from 'path';
import * as sharp from 'sharp';
import * as fs from 'fs';
import { config } from '../config/config';
import * as moment from 'moment';

export const editFileName = (_req: unknown, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void): void => {
    let name = file.originalname.split('.')[0];
    name = name.replace(/[^\w\s-]/g, ''); // Xóa tất cả các ký tự không phải chữ cái, số, dấu gạch dưới hoặc dấu gạch ngang
    if (name.includes(' ')) {
        name = name.split(' ').join('-');
    }
    if (name.includes('-')) {
        name = name.split('_').join('-'); // Thay thế tất cả các dấu - bằng dấu gạch dưới _
    }
    const fileExtName = extname(file.originalname);
    const randomName = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
    callback(null, `${name}_${randomName}${fileExtName}`);
};

export const imageFileFilter = (req: unknown, file: Express.Multer.File, callback: FileFilterCallback): void => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|xlsx|xls|vtt)$/i)) {
        return callback(new HttpException('Chỉ cho phép các tệp hình ảnh jpg, jpeg, png, gif, webp!', HttpStatus.UNPROCESSABLE_ENTITY));
    }
    callback(null, true);
};
export const fileFilter = (req: unknown, file: Express.Multer.File, callback: FileFilterCallback): void => {
    if (!file.originalname.match(/\.(xls|xlsx)$/)) {
        return callback(new HttpException('Only files excel are allowed!', HttpStatus.UNPROCESSABLE_ENTITY));
    }
    callback(null, true);
};

export const filePdfFilter = (req: unknown, file: Express.Multer.File, callback: FileFilterCallback): void => {
    if (!file.originalname.match(/\.(pdf)$/)) {
        return callback(new HttpException('Only files pdf are allowed!', HttpStatus.UNPROCESSABLE_ENTITY));
    }
    callback(null, true);
};
export const getImageSize = (imagePath: string) => {
    const sizeOf = require('image-size');
    return sizeOf(imagePath);
};
export const resizeAndSaveImage = async (inputPath: string, fileName: string, toSize: [number, number], outputPath: string): Promise<any> => {
    let outputPathandName = `${outputPath}/${fileName}`;
    console.log('outputPath', outputPath);
    console.log('inputPath', inputPath);

    const result = await sharp(inputPath).resize(toSize[0], toSize[1]).toFile(outputPathandName);
    outputPathandName = outputPathandName.slice(2, outputPathandName.length).split('/').join('\\');
    inputPath = inputPath.split('\\').join('/');
    return {
        filename: fileName,
        path: outputPathandName,
        mimetype: `image/${result.format}`,
        ...result,
        destination: outputPath,
        originalname: fileName,
    };
};

export const storeFileAfterUpload = (fileUpload) => {
    const storeFilePath = config().destination + '/schedule/month' + `/${new Date().getFullYear()}` + `/${new Date().getMonth() + 1}`;
    fs.mkdirSync(storeFilePath, { recursive: true });
    const [name, ext] = fileUpload.originalname.split('.');
    const writeStream = fs.createWriteStream(storeFilePath + '/' + name + '_' + moment().format('HH-mm') + '.' + ext);
    writeStream.write(fileUpload.buffer);
    writeStream.end();
};
