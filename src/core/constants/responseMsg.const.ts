export const responseMsg = {
    SUCCESS: {
        CODE: 0,
        MESSAGE: 'Thành công!',
    },
    FAIL: {
        CODE: -1,
        MESSAGE: 'Thất bại',
    },
    SERVER_ERROR: {
        CODE: 500,
        MESSAGE: 'Có lỗi khi kết nối đến máy chủ. (500)',
    },
    CONFIG_DB_INVALID: {
        CODE: -3,
        MESSAGE: 'Config DB invalid!',
    },
    REDIS_ERROR: {
        CODE: -4,
        MESSAGE: 'Error redis!',
    },
    FILE_ERROR: {
        CODE: -5,
        MESSAGE: 'Error file!',
    },
    AUTH_AUTHORIZED: {
        CODE: 401,
        MESSAGE: 'AUTHORIZED!',
    },
    AUTH_MANUAL_FACTORID_INVALID: {
        CODE: -768,
        MESSAGE: 'Invalid ManualFactorId!',
    },
    AUTH_IP_INVALID: {
        CODE: -769,
        MESSAGE: 'Invalid IP!',
    },
    AUTH_TOKEN_INVALID: {
        CODE: -24,
        MESSAGE: 'Invalid Token!',
    },
    AUTH_MEMBER_INVALID: {
        CODE: -771,
        MESSAGE: 'Invalid Member!',
    },
    AUTH_DEVICE_DELETED: {
        CODE: -50,
        MESSAGE: 'Device is deleted!',
    },
    AUTH_DEVICE_ADD_PACKAGE: {
        CODE: -23,
        MESSAGE: 'Device update package!',
    },
    INVALID_CCU: {
        CODE: 854,
        MESSAGE: 'Vượt quá thiết bị được phép xem nội dung. Vui lòng vào mục Hỗ trợ - Quản lý thiết bị để kiểm tra danh sách thiết bị đang xem.',
    },
};
