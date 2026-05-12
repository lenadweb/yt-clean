import { isOpera } from 'src/shared/utils/browser';
import { Storage } from 'src/shared/storage';
import { DEFAULT_STORAGE } from 'src/shared/storage/config';
import { Message } from 'src/shared/types/messages';

export class Background {
    isOpera = isOpera();
    private storage: Storage;

    constructor() {
        this.setEvents();
        this.storage = new Storage(DEFAULT_STORAGE);
    }

    setEvents() {
        if (isOpera()) return;
        if (typeof chrome.sidePanel !== 'undefined') {
            chrome.sidePanel
                .setPanelBehavior({ openPanelOnActionClick: true })
                .catch((error) => console.error(error));
        }
        chrome.runtime.onMessage.addListener(
            (message: Message, sender, sendResponse) => {
                const handler = this?.[message.type as keyof typeof this];
                if (typeof handler === 'function') {
                    (async () => {
                        const response = await handler.call(
                            this,
                            message.payload
                        );
                        sendResponse(response);
                    })();
                }
                return true;
            }
        );
    }
}

async function createBackgroundInstance() {
    return new Background();
}

createBackgroundInstance().then((instance) => {
    (globalThis as any).background = instance;
});
