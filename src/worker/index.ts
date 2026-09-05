import { isOpera } from 'src/shared/utils/browser';
import {
    EXTENSION_ENABLED_BY_DEFAULT,
    TOGGLE_EXTENSION_COMMAND,
} from 'src/shared/const';

let commandQueue = Promise.resolve();

const toggleExtension = async (): Promise<void> => {
    const { isEnabled = EXTENSION_ENABLED_BY_DEFAULT } =
        await chrome.storage.local.get('isEnabled');

    await chrome.storage.local.set({ isEnabled: !isEnabled });
};

chrome.commands.onCommand.addListener((command) => {
    if (command !== TOGGLE_EXTENSION_COMMAND) return;

    commandQueue = commandQueue
        .then(toggleExtension)
        .catch((error) => console.error(error));
});

chrome.runtime.onInstalled.addListener(({ reason }) => {
    if (reason !== 'install') return;

    chrome.tabs.create({
        url: chrome.runtime.getURL('onboarding.html'),
    });
});

if (!isOpera() && chrome.sidePanel) {
    chrome.sidePanel
        .setPanelBehavior({ openPanelOnActionClick: true })
        .catch((error) => console.error(error));
}
