import { DEFAULT_STORAGE } from 'src/shared/storage/config';
import { Storage } from 'src/shared/storage';
import { sleep } from 'src/shared/utils/common';
import { getStartOfToday } from 'src/shared/utils/date';

export class TimeTracker {
    private storage: Storage;
    private key = 'spentTimeToday' as const;
    private intervalMs = 60_000;
    private intervalId: ReturnType<typeof setInterval> | null = null;

    constructor() {
        this.storage = new Storage(DEFAULT_STORAGE);
        sleep(500).then(() => {
            this.start();
        });
    }

    isVideoPlaying(): boolean {
        let movieContainer = document.querySelector('#movie_player');
        if (movieContainer) {
            const video = movieContainer.getElementsByTagName('video')[0];
            return (
                !!video && !video.paused && !video.ended && video.readyState > 2
            );
        }
        return false;
    }

    private updateTime() {
        const current = this.storage.get(this.key);
        const todayStart = getStartOfToday();

        if (!current.tmstp || current.tmstp < todayStart) {
            this.storage.update(this.key, {
                ...current,
                value: '1',
                tmstp: todayStart,
            });
        } else {
            this.storage.update(this.key, {
                ...current,
                value: String((Number(current?.value) || 0) + 1),
                tmstp: current.tmstp,
            });
        }
    }

    start() {
        if (this.intervalId) return;

        this.intervalId = setInterval(() => {
            const isVideoPlaying = this.isVideoPlaying();
            if (isVideoPlaying) {
                this.updateTime();
            }
        }, this.intervalMs);
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    reset() {
        const current = this.storage.get(this.key);
        this.storage.update(this.key, {
            ...current,
            value: '0',
            tmstp: getStartOfToday(),
        });
    }
}

new TimeTracker();
