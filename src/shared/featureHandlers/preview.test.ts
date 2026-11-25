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

class Node {
    constructor(private readonly matches: string[]) {}
    closest(selector: string) {
        return this.matches.some((m) => selector.includes(m)) ? {} : null;
    }
}

const setup = () => {
    const add = vi.fn();
    const remove = vi.fn();
    const winAdd = vi.fn();
    const winRemove = vi.fn();
    vi.stubGlobal('HTMLVideoElement', Video);
    vi.stubGlobal('Element', Node);
    vi.stubGlobal('window', {
        addEventListener: winAdd,
        removeEventListener: winRemove,
    });
    return { add, remove, winAdd, winRemove };
};

describe('hover preview control', () => {
    afterEach(() => vi.unstubAllGlobals());

    it('pauses current and future previews while preserving normal playback', () => {
        const { add, remove } = setup();
        const preview = new Video(true);
        const normal = new Video(false);
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

    it('blocks hover events on thumbnails so the preview never starts', () => {
        const { add, remove, winAdd, winRemove } = setup();
        vi.stubGlobal('document', {
            addEventListener: add,
            removeEventListener: remove,
            querySelectorAll: () => [],
        });
        enableHoverPreview();
        const types = winAdd.mock.calls.map(([type]) => type);
        expect(types).toContain('mouseenter');
        expect(types).toContain('mouseover');
        const listener = winAdd.mock.calls[0][1];
        const run = (target: unknown) => {
            const event = { target, stopImmediatePropagation: vi.fn() };
            listener(event);
            return event.stopImmediatePropagation;
        };
        expect(run(new Node(['ytd-thumbnail']))).toHaveBeenCalled();
        expect(run(new Node(['yt-thumbnail-view-model']))).toHaveBeenCalled();
        expect(
            run(new Node(['ytd-thumbnail', 'button']))
        ).not.toHaveBeenCalled();
        expect(run(new Node([]))).not.toHaveBeenCalled();
        disableHoverPreview();
        expect(winRemove).toHaveBeenCalledTimes(winAdd.mock.calls.length);
        winAdd.mock.calls.forEach(([type, fn, capture]) =>
            expect(winRemove).toHaveBeenCalledWith(type, fn, capture)
        );
    });
});
