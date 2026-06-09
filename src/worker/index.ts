import { isOpera } from 'src/shared/utils/browser';

if (!isOpera() && chrome.sidePanel) {
    chrome.sidePanel
        .setPanelBehavior({ openPanelOnActionClick: true })
        .catch((error) => console.error(error));
}
