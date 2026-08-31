import { isOpera } from 'src/shared/utils/browser';

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
