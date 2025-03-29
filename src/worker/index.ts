import { isOpera } from 'src/shared/utils/browser';

export class Background {
    isOpera = isOpera();
    constructor() {
        this.setEvents();
    }

    setEvents() {
        if (isOpera()) return;
        if (typeof chrome.sidePanel !== 'undefined') {
            chrome.sidePanel
                .setPanelBehavior({ openPanelOnActionClick: true })
                .catch((error) => console.error(error));
        }
    }
}

async function createBackgroundInstance() {
    return new Background();
}

createBackgroundInstance().then((instance) => {
    (globalThis as any).background = instance;
});
