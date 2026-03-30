import { map, mapKeys } from 'lodash';
import * as moment from 'moment';

export function removeAlias(replace_string: string, raw_data: any) {
    const regex = new RegExp('^' + replace_string + '_');
    return map(raw_data, (item) => {
        return mapKeys(item, (value, key) => key.replace(regex, ''));
    });
}

export function getNow() {
    return moment().format('YYYY-MM-DD HH:mm:ss');
}
