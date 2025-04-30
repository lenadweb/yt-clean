import { isOpera } from 'src/shared/utils/browser';
import TabChangeInfo = chrome.tabs.TabChangeInfo;
import Tab = chrome.tabs.Tab;
import { Storage } from 'src/shared/storage';
import { DEFAULT_STORAGE } from 'src/shared/storage/config';
import { getStartOfToday } from 'src/shared/utils/date';

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
            chrome.tabs.onUpdated.addListener(this.onUpdated.bind(this));
        }
    }

    getBlockedPage() {
        const extensionID = chrome.runtime.id;
        return `chrome-extension://${extensionID}/blocked.html`;
    }

    async onUpdated(tabId: number, changeInfo: TabChangeInfo, tab: Tab) {
        if (!tab.url || tab.id === undefined) return;
        if (tabId === -1) return;
        const isYoutube = new URL(tab.url).host.includes('youtube.com');
        if (!isYoutube) return;
        const limitIsEnabled =
            this.storage.get('dailyTimeLimit')?.enabled || false;
        if (this.checkIsTimeSpent() && limitIsEnabled) {
            await this.forceUpdateTab(tab.id, this.getBlockedPage());
        }
    }

    async forceUpdateTab(tabId: number, url: string) {
        await chrome.tabs.update(tabId, { url });
    }

    getTimeSpent(): number {
        const current = this.storage.get('spentTimeToday');
        const todayStart = getStartOfToday();

        if (!current.tmstp || current.tmstp < todayStart) {
            return 0;
        }

        return Number(current?.value) || 0;
    }

    checkIsTimeSpent() {
        const minutesSpent = this.getTimeSpent();
        if (minutesSpent) {
            const limit = this.storage.get('dailyTimeLimit');
            return Number(limit.valueInMinutes || '0') < minutesSpent;
        }
        return false;
    }
}

async function createBackgroundInstance() {
    return new Background();
}

createBackgroundInstance().then((instance) => {
    (globalThis as any).background = instance;
});
