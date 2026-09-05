import React, { CSSProperties, FC } from 'react';
import cn from 'classnames';
import App, { SidebarMock } from 'src/sidebar/App';
import { DEFAULT_STORAGE } from 'src/shared/storage/config';
import englishMessages from 'src/_locales/en/messages.json';

const mock: SidebarMock = {
    hideShortcut: true,
    hideFooter: true,
    messages: englishMessages,
    settings: {
        ...DEFAULT_STORAGE,
        activePreset: 'custom',
        presetWarningDismissed: true,
        voiceButtonInSearch: { enabled: true },
        virtualKeyboard: { enabled: true },
        hideSearchTags: { enabled: true },
        hideCreateVideo: { enabled: true },
        notificationButton: { enabled: true },
    },
};

type Props = {
    height: number;
    width?: number;
    scale?: number;
    style?: CSSProperties;
    dense?: boolean;
    bleed?: boolean;
};

const SidebarPanel: FC<Props> = ({
    height,
    width = 380,
    scale = 1.4,
    style,
    dense,
    bleed,
}) => (
    <div
        className={cn(
            'promo-panel',
            dense && 'promo-panel--dense',
            bleed && 'promo-panel--bleed'
        )}
        style={{ width: width * scale, height: height * scale, ...style }}
    >
        <div
            className="promo-panel__body"
            style={{ width, minHeight: height, transform: `scale(${scale})` }}
        >
            <App mock={mock} />
        </div>
    </div>
);

export default SidebarPanel;
