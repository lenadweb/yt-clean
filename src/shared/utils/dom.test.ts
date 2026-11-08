import { afterEach, describe, expect, it, vi } from 'vitest';
import { waitForElement } from 'src/shared/utils/dom';

describe('cancellable element waits', () => {
    afterEach(() => {
        vi.useRealTimers();
        vi.unstubAllGlobals();
    });

    it('does not return an existing node for an already-aborted operation', async () => {
        const controller = new AbortController();
        controller.abort();
        const querySelector = vi.fn(() => ({}));
        vi.stubGlobal('document', { documentElement: { querySelector } });
        expect(
            await waitForElement('video', { signal: controller.signal })
        ).toBeNull();
        expect(querySelector).not.toHaveBeenCalled();
    });

    it('disconnects its observer and clears timeouts on cancellation', async () => {
        vi.useFakeTimers();
        const disconnect = vi.fn();
        vi.stubGlobal('document', {
            documentElement: { querySelector: () => null },
        });
        vi.stubGlobal(
            'MutationObserver',
            class {
                observe = vi.fn();
                disconnect = disconnect;
            }
        );
        const controller = new AbortController();
        const waiting = waitForElement('video', {
            signal: controller.signal,
            timeout: 10000,
        });
        controller.abort();
        expect(await waiting).toBeNull();
        expect(disconnect).toHaveBeenCalledTimes(1);
        expect(vi.getTimerCount()).toBe(0);
    });
});
