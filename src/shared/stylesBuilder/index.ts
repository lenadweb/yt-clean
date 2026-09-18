import { ElementActions, FeatureAction } from 'src/shared/types/config';
import { FEATURES, SECTIONS } from 'src/shared/featureConfig';
import { VIDEO_FILTER_STYLE } from 'src/shared/videoFilter';

const HIDE_STYLE = 'display: none !important;';

const buildActionStyles = (action: FeatureAction): string[] => {
    switch (action.action) {
        case ElementActions.hide:
            return action.selectors.map(
                (selector) => `[${action.attr}] ${selector} { ${HIDE_STYLE} }`
            );
        case ElementActions.customStyles:
            return action.customStyles.map(
                (style) => `[${action.attr}] ${style}`
            );
        default:
            return [];
    }
};

const allActions = [
    ...FEATURES.flatMap((feature) => feature.actions),
    ...SECTIONS.flatMap((section) => section.onFullGroupEnabledActions ?? []),
];

export const styles = [
    ...allActions.flatMap(buildActionStyles),
    VIDEO_FILTER_STYLE,
].join('\n');
