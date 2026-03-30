import { FastifyRequest } from 'fastify';
import { config } from '../config/config';

interface FileMapper {
    file: Express.Multer.File;
    req: FastifyRequest;
}

interface FilesMapper {
    files: Express.Multer.File[];
    req: FastifyRequest;
}

export const fileMapper = ({ file }: FileMapper) => {
    const updatedPath = file.destination.replace('./public/', '');
    const image_url = `${config().domain_api}/api/v1/cms-api/${updatedPath}/${file.filename}`;
    return {
        originalname: file.originalname,
        filename: file.filename,
        image_url,
    };
};

export const filesMapper = ({ files }: FilesMapper) => {
    return files.map((file) => {
        const updatedPath = file.destination.replace('./public/', '');
        const image_url = `${config().domain_api}/api/v1/cms-api/${updatedPath}/${file.filename}`;
        return {
            originalname: file.originalname,
            filename: file.filename,
            image_url,
        };
    });
};
