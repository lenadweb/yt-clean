import { ElementActions } from 'src/shared/types/config';
import { CONFIG } from 'src/shared/config/index';
import { getAttr } from 'src/shared/utils/getAttr';

export const CSS_BY_COMMAND: Partial<Record<ElementActions, string>> = {
    [ElementActions.hide]: 'display: none !important;',
};

export const DEFAULT_CLASSES = {
    hide: getAttr('hide-class'),
};

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
    ${CSS_BY_COMMAND.hide}
}

${RIGHT_MODE_STYLES}
`;

export const ALLOWED_COMMANDS: ElementActions[] = [ElementActions.hide];

export const styles = CONFIG.domActions
    .flatMap((item) =>
        item.settings.flatMap(({ groups }) =>
            groups.flatMap((group) =>
                group.actions.flatMap((action) =>
                    ALLOWED_COMMANDS.includes(action.action)
                        ? action.selectors.map(
                              (selector) =>
                                  `[${action.attr}] ${selector} { ${
                                      CSS_BY_COMMAND[action.action]
                                  } }`
                          )
                        : []
                )
            )
        )
    )
    .filter(Boolean)
    .join('\n')
    .concat(`\n${DEFAULT_STYLES}`);
