import { BASE_ATTR_PREFIX } from 'src/shared/const';

export const getAttr = (name: string): string => `${BASE_ATTR_PREFIX}-${name}`;
