import { ElementActions, RuntimeAction } from 'src/shared/types/config';
import { FEATURES } from 'src/shared/featureConfig';
import { getAttr } from 'src/shared/utils/getAttr';

const HIDE_STYLE = 'display: none !important;';

const RIGHT_MODE_ATTR = getAttr('right-comment-mode');

const RIGHT_MODE_STYLES = `
[${RIGHT_MODE_ATTR}] #columns {
    flex-direction: column;
    display: grid;
    grid-template-columns: 1fr;
}

[${RIGHT_MODE_ATTR}] #primary {
    display: flex;
    flex-direction: row;
    max-width: none!important;
}

[${RIGHT_MODE_ATTR}] #primary-inner {
    display: flex;
}

[${RIGHT_MODE_ATTR}] #below {
    max-height: 504px;
    overflow: auto;
    margin-left: 32px;
}

[${RIGHT_MODE_ATTR}] #secondary {
    width: 100%!important;
}

[${RIGHT_MODE_ATTR}] #columns {
    display: block!important;
}

[${RIGHT_MODE_ATTR}] #primary > #primary-inner {
    flex: 1 1 100%;
}

[${RIGHT_MODE_ATTR}] #secondary-inner #related #items ytd-item-section-renderer > #contents {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(370px, 1fr));
    gap: 24px;
    padding: 24px;
}

[${RIGHT_MODE_ATTR}] #secondary #items .yt-related-chip-cloud-renderer #scroll-container {
    width: 100%;
}
`;

const DEFAULT_STYLES = `
.${getAttr('hide-class')} {
    ${HIDE_STYLE}
}

${RIGHT_MODE_STYLES}
`;

const buildActionStyles = (action: RuntimeAction): string[] => {
    if (action.action === ElementActions.hide) {
        return (
            action.selectors?.map(
                (selector) => `[${action.attr}] ${selector} { ${HIDE_STYLE} }`
            ) ?? []
        );
    }

    if (action.action === ElementActions.customStyles) {
        return (
            action.customStyles?.map((item) => `[${action.attr}] ${item}`) ?? []
        );
    }

    return [];
};

const getSectionActions = (): RuntimeAction[] =>
    FEATURES.flatMap((feature) => feature.ui?.onFullGroupEnabledActions || []);

export const styles = [...FEATURES.flatMap(({ actions }) => actions)]
    .concat(getSectionActions())
    .flatMap(buildActionStyles)
    .filter(Boolean)
    .join('\n')
    .concat(`\n${DEFAULT_STYLES}`);
