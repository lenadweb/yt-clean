import React, { useEffect, useState } from 'react';
import { TOGGLE_EXTENSION_COMMAND } from 'src/shared/const';
import { t } from 'src/shared/utils/i18n';
import { isOpera } from 'src/shared/utils/browser';
import Tooltip from 'src/sidebar/components/Tooltip';

const SHORTCUT_SETTINGS_URL = isOpera()
    ? 'opera://extensions/shortcuts'
    : 'chrome://extensions/shortcuts';

const KeyboardShortcuts = () => {
    const [shortcut, setShortcut] = useState('');
    const shortcutLabel = shortcut || t('shortcut_not_set');

    useEffect(() => {
        let isMounted = true;

        const refreshShortcut = () => {
            chrome.commands.getAll((commands) => {
                if (!isMounted) return;

                const toggleCommand = commands.find(
                    ({ name }) => name === TOGGLE_EXTENSION_COMMAND
                );
                setShortcut(toggleCommand?.shortcut ?? '');
            });
        };

        const refreshVisibleShortcut = () => {
            if (!document.hidden) refreshShortcut();
        };

        refreshShortcut();
        window.addEventListener('focus', refreshShortcut);
        document.addEventListener('visibilitychange', refreshVisibleShortcut);

        return () => {
            isMounted = false;
            window.removeEventListener('focus', refreshShortcut);
            document.removeEventListener(
                'visibilitychange',
                refreshVisibleShortcut
            );
        };
    }, []);

    const openShortcutSettings = () => {
        void chrome.tabs.create({ url: SHORTCUT_SETTINGS_URL });
    };

    return (
        <Tooltip label={t('change_shortcut')}>
            <button
                type="button"
                onClick={openShortcutSettings}
                aria-label={`${t('change_shortcut')}: ${shortcutLabel}`}
                className="flex h-9 cursor-pointer items-center rounded-full bg-black-700 px-3 text-black-200 transition duration-150 focus:outline-none active:scale-95 hover:bg-black-600"
            >
                <kbd className="shortcut-key text-xs font-normal leading-none">
                    {shortcutLabel}
                </kbd>
            </button>
        </Tooltip>
    );
};

export default KeyboardShortcuts;
