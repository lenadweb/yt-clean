import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
    disableHomeRedirect,
    enableHomeRedirect,
} from 'src/shared/featureHandlers/navigation';
import { getHomeRedirectUrl } from 'src/shared/utils/homeRedirect';

describe('Home redirect', () => {
    const replace = vi.fn();
    const disconnect = vi.fn();
    const observe = vi.fn();
    let onMutation: () => void;
    let signedIn: boolean;
    let location: { href: string; replace: typeof replace };

    beforeEach(() => {
        signedIn = false;
        location = { href: 'https://www.youtube.com/', replace };
        vi.stubGlobal('window', { location });
        vi.stubGlobal('document', {
            documentElement: {},
            querySelector: () => (signedIn ? {} : null),
        });
        vi.stubGlobal(
            'MutationObserver',
            class {
                observe = observe;
                disconnect = disconnect;
                constructor(callback: () => void) {
                    onMutation = callback;
                }
            }
        );
        vi.clearAllMocks();
    });

    afterEach(() => {
        disableHomeRedirect();
        vi.unstubAllGlobals();
    });

    it('waits for the signed-in masthead and replaces Home only once', () => {
        enableHomeRedirect();
        expect(replace).not.toHaveBeenCalled();

        signedIn = true;
        onMutation();
        onMutation();
        enableHomeRedirect();

        expect(replace).toHaveBeenCalledOnce();
        expect(replace).toHaveBeenCalledWith(
            'https://www.youtube.com/feed/subscriptions'
        );
        expect(disconnect).toHaveBeenCalledOnce();
    });

    it('redirects immediately when the account button is already loaded', () => {
        signedIn = true;
        enableHomeRedirect();
        expect(replace).toHaveBeenCalledOnce();
    });

    it('never redirects signed-out users', () => {
        enableHomeRedirect();
        onMutation();
        expect(replace).not.toHaveBeenCalled();
    });

    it('stops observing when the setting or extension is disabled', () => {
        enableHomeRedirect();
        disableHomeRedirect();
        expect(disconnect).toHaveBeenCalledOnce();

        signedIn = true;
        onMutation();
        expect(replace).not.toHaveBeenCalled();
        enableHomeRedirect();
        expect(replace).toHaveBeenCalledOnce();
    });

    it('does not redirect after a navigation away from Home', () => {
        enableHomeRedirect();
        location.href = 'https://www.youtube.com/watch?v=abc';
        signedIn = true;
        onMutation();
        expect(replace).not.toHaveBeenCalled();
    });

    it.each([
        'https://www.youtube.com/feed/subscriptions',
        'https://www.youtube.com/watch?v=abc',
        'https://www.youtube.com/results?search_query=test',
        'https://www.youtube.com/@channel',
        'https://example.com/',
    ])('keeps %s unchanged', (url) => {
        expect(getHomeRedirectUrl(url, true)).toBeNull();
    });

    it('keeps the YouTube origin and discards Home query parameters', () => {
        expect(getHomeRedirectUrl('https://youtube.com/?hl=ru', true)).toBe(
            'https://youtube.com/feed/subscriptions'
        );
    });
});
