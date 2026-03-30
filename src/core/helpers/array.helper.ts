import { filter, includes, isEmpty, omitBy, split } from 'lodash';
import { isEmptyString } from './string.helper';

export const isEmptyArray = (data) => Boolean(!data || data.constructor !== Array || !data.length);

export const array_diff = (arrayA, arrayB) => {
    return omitBy(arrayB, (v, k) => {
        return arrayA[k] === v;
    });
};

//Thêm một phần tử vào đầu mảng và xoá phần tử thêm đã tồn tại trong mảng
export const AddOneItemToFirstArray = (aData, item, iLimit = 0) => {
    console.log('aData AddOneItemToFirstArray: ', aData);
    const iCnt = aData.length;
    const iExists = aData.findIndex(
        (ele) => parseInt(ele.content_id) === parseInt(item.content_id) && parseInt(ele.type_id) === parseInt(item.type_id),
    );
    if (iExists === -1) {
        if (iLimit === 0 || iCnt < iLimit) {
            aData.unshift(item);
        } else {
            aData.splice(iLimit - 1, iCnt - iLimit + 1);
            aData.unshift(item);
        }
        console.log('aData AddOneItemToFirstArray21: ', aData);
    } else {
        aData.splice(iExists, 1);
        aData.unshift(item);
    }
    return aData;
};

export const filterCateByDevice = (cates, device_type) => {
    if (!isEmpty(cates)) {
        cates = filter(cates, (ele) => {
            if (!ele.HIDDEN_DEVICE_LIST) return true;
            if (ele.HIDDEN_DEVICE_LIST === null) return true;
            if (isEmptyString(ele.HIDDEN_DEVICE_LIST)) return true;
            const aLst = split(ele.HIDDEN_DEVICE_LIST, ',');
            if (includes(aLst, device_type.toString())) return false;
            return true;
        });
    }
    return cates;
};

export const arrayColumn = (array, keyColumn, valueColumn) => {
    return array.reduce((result, item) => {
        result[item[keyColumn]] = item[valueColumn];
        return result;
    }, {});
};

export const paginate = (array, page_size, page_number) => {
    return array.slice((page_number - 1) * page_size, page_number * page_size);
};
