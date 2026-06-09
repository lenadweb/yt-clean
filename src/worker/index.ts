import { isOpera } from 'src/shared/utils/browser';

// Open the side panel when the toolbar icon is clicked.
// Opera has no sidePanel API, so this is Chromium-only.
if (!isOpera() && chrome.sidePanel) {
    chrome.sidePanel
        .setPanelBehavior({ openPanelOnActionClick: true })
        .catch((error) => console.error(error));
}
