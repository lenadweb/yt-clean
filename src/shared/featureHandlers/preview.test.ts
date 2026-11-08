import { afterEach, describe, expect, it, vi } from 'vitest';
import {
    disableHoverPreview,
    enableHoverPreview,
} from 'src/shared/featureHandlers/preview';

class Video {
    paused = false;
    pause = vi.fn(() => {
        this.paused = true;
    });
    constructor(private readonly preview: boolean) {}
    closest() {
        return this.preview ? {} : null;
    }
}

describe('hover preview control', () => {
    afterEach(() => vi.unstubAllGlobals());

    it('pauses current and future previews while preserving normal playback', () => {
        const preview = new Video(true);
        const normal = new Video(false);
        const add = vi.fn();
        const remove = vi.fn();
        vi.stubGlobal('HTMLVideoElement', Video);
        vi.stubGlobal('document', {
            addEventListener: add,
            removeEventListener: remove,
            querySelectorAll: () => [preview],
        });
        enableHoverPreview();
        expect(preview.pause).toHaveBeenCalledTimes(1);
        const [event, listener, capture] = add.mock.calls[0];
        preview.paused = false;
        listener({ target: preview });
        listener({ target: normal });
        expect(preview.pause).toHaveBeenCalledTimes(2);
        expect(normal.pause).not.toHaveBeenCalled();
        disableHoverPreview();
        expect(remove).toHaveBeenCalledWith(event, listener, capture);
    });
});
