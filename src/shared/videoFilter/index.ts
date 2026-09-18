import { getAttr } from 'src/shared/utils/getAttr';

export const VIDEO_FILTER_HIDDEN_ATTR = getAttr('filter-hidden');

export const VIDEO_FILTER_STYLE = `[${VIDEO_FILTER_HIDDEN_ATTR}] { display: none !important; }`;
