import { HttpException, HttpStatus } from '@nestjs/common';
import * as Excel from 'exceljs';
import { forEach, isEmpty } from 'lodash';
import * as moment from 'moment';
import { config } from '../config/config';

export const handleScheduleByDay = async (filePath) => {
    const workbook = new Excel.Workbook();
    await workbook.xlsx.load(filePath);
    // get all sheets in file
    const worksheets = workbook.worksheets;
    const schedules = []; // type Schedule
    // loop all sheets
    worksheets.forEach((worksheet, index) => {
        if (index > 0) throw new HttpException('File Excel is have many sheets', 404);
        // loop all row
        worksheet.eachRow((row) => {
            const cellValue = [];
            // loop all cells
            row.eachCell((cell, cellNumber) => {
                if (cellNumber > 3) throw new HttpException('Two many cell', 404);
                cellValue.push(cell.value);
            });
            schedules.push(cellValue);
        });
    });
    const result = {
        SCHEDULE_DATE: moment(schedules[0][0]).format('YYYY-MM-DD'),
        SCHEDULE_CONTENT: '',
    };
    for (const schedule of schedules) {
        result.SCHEDULE_CONTENT += moment(schedule[1]).utc().format('HH:mm') + ' ' + schedule[2] + '\n';
    }
    // console.log('🚀 ~ file: index-v3.js:34 ~ .then ~ result:', result);
    return result;
};

/**
 * downloadExcel
 * @param header
 * @param data
 * @param merges
 */

export const exportExcel = async (filePath: string, headers: any, data: any, headInfo: any[] = []) => {
    console.log('exportExcel', data);
    if (isEmpty(data)) {
        throw new HttpException('no data for download', HttpStatus.BAD_REQUEST);
    }
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');
    worksheet.columns = headers;
    if (headInfo.length > 0) {
        let columnLetter = '';
        let setHeaderLenght = headers.length;
        // Lấy chuỗi tương ứng với column từ header.lenght
        while (setHeaderLenght > 0) {
            const remainder = (setHeaderLenght - 1) % 26;
            columnLetter = String.fromCharCode(65 + remainder) + columnLetter;
            setHeaderLenght = Math.floor((setHeaderLenght - remainder) / 26);
        }
        // kết quả columnLetter (example 1-->A, 2-->B, 28-->AB, 53-->BA, 737-->ABI) dùng đánh dấu cột merge đến
        worksheet.duplicateRow(1, headInfo.length, false);
        // duplicate Row đầu đến số lượng mảng info đầu +1.
        for (let i = 0; i < headInfo.length; i++) {
            // Gán các giá trị string vào từng hàng
            worksheet.getRow(i + 1).values = [headInfo[i]];
            // Gộp sau khi gán
            worksheet.mergeCells(`A${i + 1}:${columnLetter}${i + 1}`);
        }
        // đẩy giá trị header
        // worksheet.getRow(headInfo.length + 1).values = []
    }
    for (const rowItem in data) {
        worksheet.addRow(data[rowItem]);
    }
    workbook.xlsx
        .writeFile(process.cwd() + filePath)
        .then(() => {
            console.log('ghi file thành công');
        })
        .catch((error) => {
            console.log('error', error);
            throw new HttpException('data is invalid', HttpStatus.BAD_REQUEST);
        });
    const updatedPath = filePath.replace('/public/', '');
    const filename = `${config().domain_api}/api/v1/cms-api/${updatedPath}`;
    console.log('filename', filename);
    return filename;
};
export const exportExcelStatistc = async (filePath: string, headers: any, data: any, headInfo: any[] = []) => {
    if (isEmpty(data)) {
        throw new HttpException('no data for download', HttpStatus.BAD_REQUEST);
    }
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');
    worksheet.columns = headers;
    if (headInfo.length > 0) {
        let columnLetter = '';
        let setHeaderLenght = headers.length;
        // Lấy chuỗi tương ứng với column từ header.lenght
        while (setHeaderLenght > 0) {
            const remainder = (setHeaderLenght - 1) % 26;
            columnLetter = String.fromCharCode(65 + remainder) + columnLetter;
            setHeaderLenght = Math.floor((setHeaderLenght - remainder) / 26);
        }
        // kết quả columnLetter (example 1-->A, 2-->B, 28-->AB, 53-->BA, 737-->ABI) dùng đánh dấu cột merge đến
        worksheet.duplicateRow(1, headInfo.length + 1, true);
        // duplicate Row đầu đến số lượng mảng info đầu +1.
        for (let i = 0; i < headInfo.length; i++) {
            // Gán các giá trị string vào từng hàng
            worksheet.getRow(i + 1).values = [headInfo[i]];
            // Gộp sau khi gán
            worksheet.mergeCells('A' + (i + 1) + ':' + columnLetter + (i + 1));
        }
        // đẩy giá trị header
        worksheet.getRow(headInfo.length + 1).values = [];
    }
    let stt = 1;
    let flagStart = 2 + (headInfo.length > 0 ? headInfo.length + 1 : 0);
    let flagEnd = 2 + (headInfo.length > 0 ? headInfo.length + 1 : 0);
    for (let i = 0; i < data.length; i++) {
        //vòng for cho questions
        for (let j = 0; j < data[i].anwser.length; j++) {
            //vòng for cho answer
            if (data[i].anwser[j]) {
                //thêm data vào mỗi row
                const rowData = {
                    stt: stt,
                    question_text: data[i].question_text,
                    question_choice_text: data[i].anwser[j].question_choice_text,
                    number_choice: data[i].anwser[j].number_choice,
                    pt: data[i].anwser[j].pt.toFixed(2) + '%',
                };
                worksheet.addRow(rowData);
                // tăng giá trị flagEnd
                flagEnd++;
                //nếu data tiếp theo ko có thì merge column
                if (!data[i].anwser[j + 1]) {
                    //Gộp cột
                    worksheet.mergeCells('B' + flagStart + ':' + 'B' + (flagEnd - 1));
                    worksheet.mergeCells('A' + flagStart + ':' + 'A' + (flagEnd - 1));
                    //alignment item
                    worksheet.getCell('B' + flagStart).alignment = { vertical: 'middle', horizontal: 'center' };
                    worksheet.getCell('A' + flagStart).alignment = { vertical: 'middle', horizontal: 'center' };
                    //Gán cờ flag bắt đầu bằng flagEnd
                    flagStart = flagEnd;
                    //tăng cột stt +1
                    stt++;
                }
            }
        }
    }

    workbook.xlsx
        .writeFile(process.cwd() + filePath)
        .then(() => {
            console.log('ghi file thành công');
        })
        .catch((error) => {
            console.log('error', error);
            throw new HttpException('data is invalid', HttpStatus.BAD_REQUEST);
        });
    console.log(filePath);
    const updatedPath = filePath.replace('/public/', '');
    console.log(filePath);
    const filename = `${config().domain_api}/api/v1/cms-api/${updatedPath}`;
    return filename;
};
export const handleDataExcel = async (filePath: any) => {
    console.log('handleDataExcel', filePath);
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet('Sheet1');
    const data = []; // type Schedule

    // loop all sheets
    for (let v = 1; v <= worksheet.actualRowCount; v++) {
        const obj = {
            CHANNEL_ORDER: worksheet.getCell('A' + v).value,
            LIVE_TSTV_STATUS: worksheet.getCell('B' + v).value,
            TVOD_STATUS: worksheet.getCell('C' + v).value,
            START_TIME: worksheet.getCell('E' + v).value, //thoi gian bat dau
            END_TIME: worksheet.getCell('F' + v).value, //thoi gian ket thuc
        };
        data.push(obj);
    }
    data.shift();
    console.log('🚀 ~ file: index-v3.js:34 ~ .then ~ result:', data);
    return data;
};

export const handleScheduleByMonth = async (filePath) => {
    const workbook = new Excel.Workbook();
    await workbook.xlsx.load(filePath);
    // get all sheets in file
    const worksheets = workbook.worksheets;
    const schedules = {}; // type Schedule
    // loop all sheets
    worksheets.forEach((worksheet, index) => {
        if (index > 0) throw new HttpException('File Excel is have many sheets', 404);
        // loop all row
        worksheet.eachRow((row) => {
            const cellValue = [];
            // loop all cells
            row.eachCell((cell, cellNumber) => {
                if (cellNumber > 4) throw new HttpException('File ko đúng format', 404);
                cellValue.push(cell.value);
            });
            const date = moment(cellValue[0]).format('YYYY-MM-DD');
            if (!schedules[date]) schedules[date] = [cellValue];
            else schedules[date].push(cellValue);
        });
    });

    const values: any[] = Object.values(schedules);
    const result = [];
    for (const value of values) {
        const single = {
            SCHEDULE_DATE: moment(value[0][0]).format('YYYY-MM-DD'),
            SCHEDULE_CONTENT: '',
        };
        for (const e of value) {
            let time = e[1];
            if (time instanceof Date) {
                // Nếu time là một Date object
                time = moment(time).utc().format('HH:mm');
            } else if (typeof time === 'string') {
                // Nếu time là một String
                time = moment(time, 'HH:mm:ss').format('HH:mm');
            }
            single.SCHEDULE_CONTENT += time + ' ' + e[2] + '\n';
        }
        result.push(single);
    }
    return result;
};

export const handleReadFromFile = async (filePath) => {
    const workbook = new Excel.Workbook();
    await workbook.xlsx.load(filePath);
    // get all sheets in file
    const worksheets = workbook.worksheets;
    const resultRow = [];
    const resultCol = [];
    let cellCount = 0;
    let rowCount = 0;

    // loop all sheets
    worksheets.forEach((worksheet, index) => {
        if (index > 0) return;
        // loop all row
        rowCount = worksheet.rowCount - 1;
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) {
                cellCount = row.cellCount;
                return;
            }

            const cellValue = {};
            row.eachCell((cell, cellNumber) => {
                cellValue[cellNumber] = cell.value;

                if (!Array.isArray(resultCol[cellNumber])) {
                    resultCol[cellNumber] = [];
                }
                resultCol[cellNumber].push(cell.value);
            });
            resultRow.push(cellValue);
        });
    });

    return { cellCount, rowCount, resultRow, resultCol };
};

export const removeVietnameseTones = (str) => {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
    str = str.replace(/Đ/g, 'D');
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g, ' ');
    str = str.trim();
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    // eslint-disable-next-line
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, ' ');
    return str;
};

export const getSearchKeyword = (contentName) => {
    let result = '';
    if (contentName) {
        const first = removeVietnameseTones(contentName);

        const arr = contentName.split('-');
        const words = arr.map((item) => {
            const words = removeVietnameseTones(item).split(/\s+/);
            const end = words.map((word) => word.charAt(0)).join('');
            return end;
        });

        const end = words.join(' ');
        result = first + ' ' + end;
    }

    return result;
};
export const exportExcelDevice = async (filePath: string, headers: any, data: any) => {
    if (isEmpty(data)) {
        throw new HttpException('no data for download', HttpStatus.BAD_REQUEST);
    }
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');
    // let rowData: any= {}
    worksheet.columns = headers;
    forEach(data, (rowItem) => {
        worksheet.addRow(rowItem);
    });
    let filename = process.cwd() + filePath;
    workbook.xlsx
        .writeFile(filename)
        .then(() => {
            console.log('ghi file thành công');
        })
        .catch((error) => {
            console.log('error', error);
            throw new HttpException('data is invalid', HttpStatus.BAD_REQUEST);
        });
    const updatedPath = filePath.replace('/public/', '');
    filename = `${config().domain_api}/api/v1/cms-api/${updatedPath}`;
    return filename;
};
