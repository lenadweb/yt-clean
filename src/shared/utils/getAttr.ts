import { BASE_ATTR_PREFIX } from 'src/shared/const';

const generateId = () => {
    const chars =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

export const getAttr = function (attr?: string) {
    return `${BASE_ATTR_PREFIX}-${attr ? attr : generateId()}`;
};
