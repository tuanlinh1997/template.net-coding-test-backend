import { BaseController } from '../core/controllers/base.controller';
import { FileCache } from '../core/helpers/file.helper';

export class Cache extends BaseController {
    getDataFromCache = (file_name: string, path: string = 'config') => {
        try {
            const file = new FileCache();
            file.setPath(path);
            return file.getJsonObjectFromFile(file_name);
        } catch (error) {
            console.log('getDataFromCache.error', error.response);
            return null;
        }
    };
}
