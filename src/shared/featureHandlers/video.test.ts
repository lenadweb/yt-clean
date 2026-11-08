import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const dom = vi.hoisted(() => ({
    waitForElement: vi.fn(),
    observeElementChanges: vi.fn(),
    disconnectObserver: vi.fn(),
}));
vi.mock('src/shared/utils/dom', () => dom);

class Video extends EventTarget {
    playbackRate = 1;
    paused = false;
    pause = vi.fn(() => {
        this.paused = true;
    });
    closest = vi.fn(() => ({}));
}

describe('playback and trailer lifecycle', () => {
    let handlers: typeof import('src/shared/featureHandlers/video');
    let documentMock: {
        addEventListener: ReturnType<typeof vi.fn>;
        removeEventListener: ReturnType<typeof vi.fn>;
    };
    const sessionWrite = vi.fn();

    beforeEach(async () => {
        vi.resetModules();
        vi.clearAllMocks();
        vi.stubGlobal('HTMLVideoElement', Video);
        documentMock = {
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        };
        vi.stubGlobal('document', {
            ...documentMock,
            documentElement: {},
            querySelector: () => null,
        });
        vi.stubGlobal('window', {
            location: { href: 'https://www.youtube.com/watch?v=abc' },
            sessionStorage: { setItem: sessionWrite },
        });
        handlers = await import('src/shared/featureHandlers/video');
    });

    afterEach(() => {
        handlers.syncPlaybackSpeed(undefined, false);
        handlers.restoreChannelTrailer();
        vi.unstubAllGlobals();
    });

    it('never applies pending speed after the setting is disabled', async () => {
        let resolve!: (value: Video) => void;
        dom.waitForElement.mockReturnValue(
            new Promise((done) => {
                resolve = done;
            })
        );
        const enabling = handlers.syncPlaybackSpeed('2', true);
        const signal = dom.waitForElement.mock.calls[0][1]
            .signal as AbortSignal;
        await handlers.syncPlaybackSpeed('2', false);
        const video = new Video();
        resolve(video);
        await enabling;
        expect(signal.aborted).toBe(true);
        expect(video.playbackRate).toBe(1);
        expect(sessionWrite).not.toHaveBeenCalled();
        expect(dom.observeElementChanges).not.toHaveBeenCalled();
    });

    it('lets the latest speed win when waits finish out of order', async () => {
        let resolveOld!: (value: Video) => void;
        const video = new Video();
        dom.waitForElement
            .mockReturnValueOnce(
                new Promise((done) => {
                    resolveOld = done;
                })
            )
            .mockResolvedValueOnce(video);
        const old = handlers.syncPlaybackSpeed('2', true);
        await handlers.syncPlaybackSpeed('3', true);
        resolveOld(video);
        await old;
        expect(video.playbackRate).toBe(3);
        expect(sessionWrite).toHaveBeenCalledTimes(1);
        expect(dom.observeElementChanges).toHaveBeenCalledTimes(1);
    });

    it('pauses the trailer without detaching it and removes its play listener on disable', () => {
        const video = new Video();
        const trailer = { querySelectorAll: () => [video] };
        dom.observeElementChanges.mockImplementation(
            (_id, _selector, callback) => callback(trailer)
        );
        handlers.hideChannelTrailer();
        expect(video.pause).toHaveBeenCalledTimes(1);
        const [type, listener, capture] =
            documentMock.addEventListener.mock.calls[0];
        video.paused = false;
        listener({ target: video });
        expect(video.pause).toHaveBeenCalledTimes(2);
        handlers.restoreChannelTrailer();
        expect(documentMock.removeEventListener).toHaveBeenCalledWith(
            type,
            listener,
            capture
        );
        expect(dom.waitForElement).not.toHaveBeenCalled();
    });
});
