import { describe, expect, it } from 'vitest';
import { UrlRegExps } from 'src/shared/const';

describe('YouTube URL scopes', () => {
    it.each([
        ['Watch', '/watch?v=abc'],
        ['Watch', '/watch?list=WL&v=abc'],
        ['Watch', '/watch?feature=share&v=abc&t=30#chapter'],
        ['Search', '/results?search_query=test'],
        ['Search', '/results?sp=filter&search_query=test'],
        ['Search', '/results?sp=filter&search_query=test&page=2#top'],
        ['Channel', '/@handle'],
        ['Channel', '/@handle/videos'],
        ['Channel', '/@handle/streams?view=0'],
        ['Channel', '/c/name'],
        ['Channel', '/c/name/videos'],
        ['Channel', '/channel/UC123'],
        ['Channel', '/channel/UC123/videos'],
        ['Channel', '/user/name'],
        ['Channel', '/user/name/playlists'],
        ['Home', '/'],
        ['Home', '/?hl=ru#top'],
        ['Home', '/#top'],
        ['Subscriptions', '/feed/subscriptions'],
        ['Subscriptions', '/feed/subscriptions/?flow=1#top'],
    ] as const)('recognizes %s at %s', (scope, path) => {
        expect(UrlRegExps[scope].test(`https://www.youtube.com${path}`)).toBe(
            true
        );
        expect(UrlRegExps[scope].test(`https://youtube.com${path}`)).toBe(true);
    });

    it.each([
        ['Watch', '/watch?v='],
        ['Watch', '/watch?list=WL#v=abc'],
        ['Watch', '/watch?notv=abc'],
        ['Watch', '/watch?next=/watch?v=abc'],
        ['Search', '/results?search_query='],
        ['Search', '/results?sp=filter#search_query=test'],
        ['Channel', '/courses'],
        ['Channel', '/channel'],
        ['Channel', '/channel/'],
        ['Channel', '/c/'],
        ['Channel', '/user/'],
        ['Channel', '/@'],
        ['Channel', '/watch?v=abc'],
        ['Home', '/feed/subscriptions'],
        ['Subscriptions', '/feed/subscriptions-other'],
    ] as const)('does not mistake %s for %s', (scope, path) => {
        expect(UrlRegExps[scope].test(`https://www.youtube.com${path}`)).toBe(
            false
        );
    });

    it('rejects unrelated hosts', () => {
        Object.values(UrlRegExps).forEach((pattern) => {
            expect(
                pattern.test('https://youtube.com.example/watch?v=abc')
            ).toBe(false);
        });
    });
});
