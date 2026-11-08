import { afterEach, describe, expect, it, vi } from 'vitest';
import { enableAutoSkipAds } from 'src/shared/featureHandlers/ads';
import { observeElementChanges, waitForElement } from 'src/shared/utils/dom';

vi.mock('src/shared/utils/dom', () => ({
    waitForElement: vi.fn(),
    observeElementChanges: vi.fn(),
    disconnectObserver: vi.fn(),
}));

describe('ad skip cancellation', () => {
    afterEach(() => {
        vi.clearAllMocks();
        vi.unstubAllGlobals();
    });

    it('does not install observers after the enable operation is aborted', async () => {
        let resolve!: (value: null) => void;
        vi.mocked(waitForElement).mockReturnValue(
            new Promise((done) => {
                resolve = done;
            })
        );
        const controller = new AbortController();
        const enabling = enableAutoSkipAds(controller.signal);
        controller.abort();
        resolve(null);
        await enabling;
        expect(observeElementChanges).not.toHaveBeenCalled();
    });
});
