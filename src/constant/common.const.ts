export enum APIPrefix {
    version = 'api/v1',
}

export enum DB_TYPE {
    DB_TEMPLATE_NET = 'DB_TEMPLATE_NET',
}

export enum REDIS_TYPE {
    REDIS_DATA = 'redis_data',
    REDIS_MEMBER = 'redis_member_',
    REDIS_RECOMMEND = 'redis_recommend',
    REDIS_VMX = 'redis_vmx',
    REDIS_CCU = 'redis_ccu',
    REDIS_PROMOTION = 'redis_promotion',
    REDIS_PROMOTION_DATA = 'redis_promotion_data',
    REDIS_SMART_CMS = 'redis_smart_cms',
}

export const MESSAGE = {
    SUCCESS: 'success',
    FAILED: 'failed',
};

export const STATUS = {
    BAD_REQUEST: 400,
    SERVER_ERROR: 500,
};

export const RESULT = {
    ERROR_DB: -2,
};
