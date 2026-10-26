// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { computeActiveAttributes } from './features/attributes';
import { DEFAULT_STORAGE } from 'src/shared/storage/config';
import { styles } from 'src/shared/stylesBuilder';
import { FEATURES } from 'src/shared/featureConfig';
import { ElementActions } from 'src/shared/types/config';

const staticAdAttribute = 'cln-yt-cust-feature-ads-youtube-banner';
const mount = () => {
    document.body.innerHTML = readFileSync(
        path.join(__dirname, '../shared/utils/fixtures/watch-static-ads.html'),
        'utf8'
    );
    const style = document.createElement('style');
    style.textContent = styles;
    document.head.append(style);
    document.documentElement.setAttribute(staticAdAttribute, 'true');
};
afterEach(() => {
    document.body.innerHTML = '';
    document.head.innerHTML = '';
    document.documentElement.removeAttribute(staticAdAttribute);
    document.documentElement.removeAttribute(
        'cln-yt-cust-feature-ads-feed-video'
    );
    document.documentElement.removeAttribute(
        'cln-yt-cust-feature-ads-info-panel'
    );
});

describe('playback compatibility with saved ad-hiding settings', () => {
    it('preserves released ad settings while scoping their watch-page effects', () => {
        const settings = {
            ...DEFAULT_STORAGE,
            adsYoutubeBanner: { enabled: true },
            adsFeedVideo: { enabled: true },
            adsInfoPanel: { enabled: true },
        };
        const attributes = computeActiveAttributes(
            settings,
            'https://www.youtube.com/watch?v=test'
        );
        expect(attributes).toContain('cln-yt-cust-feature-ads-info-panel');
        expect(attributes).not.toContain('cln-yt-cust-feature-ads-feed-video');
        expect(attributes).toContain(staticAdAttribute);
        expect(attributes).toContain('cln-yt-cust-feature-hide-shorts');
    });
    it('hides only the ad-info engagement panel and preserves other panels', () => {
        mount();
        document.documentElement.setAttribute(
            'cln-yt-cust-feature-ads-info-panel',
            'true'
        );
        expect(
            window.getComputedStyle(document.getElementById('ad-info-panel')!)
                .display
        ).toBe('none');
        expect(
            window.getComputedStyle(document.getElementById('info-panel')!)
                .display
        ).not.toBe('none');
        document.documentElement.removeAttribute(
            'cln-yt-cust-feature-ads-info-panel'
        );
    });
    it('hides the saved sidebar layout and below-video ad slots without hiding recommendations', () => {
        mount();
        for (const id of [
            'player-ads',
            'sidebar-sponsored',
            'below-sponsored',
        ]) {
            expect(
                window.getComputedStyle(document.getElementById(id)!).display
            ).toBe('none');
        }
        for (const id of [
            'recommendation',
            'main-video',
            'native-skip',
            'home-sponsored',
            'info-panel',
        ]) {
            expect(
                window.getComputedStyle(document.getElementById(id)!).display
            ).not.toBe('none');
        }
        document.documentElement.removeAttribute(staticAdAttribute);
        expect(
            window.getComputedStyle(
                document.getElementById('sidebar-sponsored')!
            ).display
        ).not.toBe('none');
    });
    it('does not hide player ancestors or native ad modules placed inside a sidebar', () => {
        mount();
        const sidebar = document.getElementById('secondary')!;
        const wrapper = document.createElement('ytd-ad-slot-renderer');
        wrapper.append(document.querySelector('ytd-player')!);
        sidebar.append(wrapper);
        const nativeAdModule = document.querySelector('.ytp-ad-module')!;
        nativeAdModule.append(document.createElement('ytd-ad-slot-renderer'));
        const action = FEATURES.find(
            ({ id }) => id === 'adsYoutubeBanner'
        )?.actions.find(({ action }) => action === ElementActions.hide);
        expect(action).toBeDefined();
        const selectors =
            action && 'selectors' in action ? action.selectors : [];
        for (const selector of selectors) {
            for (const node of document.querySelectorAll(selector)) {
                expect(
                    node.closest('ytd-player, #movie_player, .ytp-ad-module')
                ).toBeNull();
                expect(
                    node.querySelector(
                        'ytd-player, #movie_player, .ytp-ad-module'
                    )
                ).toBeNull();
            }
        }
        for (
            let node: Element | null = document.getElementById('native-skip');
            node;
            node = node.parentElement
        ) {
            expect(window.getComputedStyle(node).display).not.toBe('none');
        }
    });
    it('keeps the static-ad option off for new installs and outside watch pages', () => {
        expect(DEFAULT_STORAGE.adsYoutubeBanner?.enabled).toBe(false);
        const settings = {
            ...DEFAULT_STORAGE,
            adsYoutubeBanner: { enabled: true },
        };
        for (const url of [
            'https://www.youtube.com/',
            'https://www.youtube.com/results?search_query=test',
        ]) {
            expect(computeActiveAttributes(settings, url)).not.toContain(
                staticAdAttribute
            );
        }
    });
});

describe('sponsored cards on Home and Subscriptions', () => {
    it('hides ad cards in grid and list layouts while preserving subscriptions and player controls', () => {
        document.body.innerHTML = readFileSync(
            path.join(
                __dirname,
                '../shared/utils/fixtures/subscriptions-ads.html'
            ),
            'utf8'
        );
        const style = document.createElement('style');
        style.textContent = styles;
        document.head.append(style);
        const attr = 'cln-yt-cust-feature-ads-feed-video';
        document.documentElement.setAttribute(attr, 'true');
        for (const id of [
            'subscription-sponsored-card',
            'subscription-list-ad',
            'subscription-legacy-ad',
            'home-ad-card',
        ]) {
            expect(
                window.getComputedStyle(document.getElementById(id)!).display
            ).toBe('none');
        }
        for (const id of [
            'subscription-video',
            'subscription-player-wrapper',
            'native-ad-slot',
        ]) {
            expect(
                window.getComputedStyle(document.getElementById(id)!).display
            ).not.toBe('none');
        }
        document.documentElement.removeAttribute(attr);
        expect(
            window.getComputedStyle(
                document.getElementById('subscription-sponsored-card')!
            ).display
        ).not.toBe('none');
    });
    it('activates on Home and Subscriptions and leaves muting optional on watch pages', () => {
        const settings = {
            ...DEFAULT_STORAGE,
            adsFeedVideo: { enabled: true },
            autoMuteAds: { enabled: true },
        };
        expect(
            computeActiveAttributes(
                settings,
                'https://www.youtube.com/feed/subscriptions'
            )
        ).toContain('cln-yt-cust-feature-ads-feed-video');
        expect(
            computeActiveAttributes(settings, 'https://www.youtube.com/')
        ).toContain('cln-yt-cust-feature-ads-feed-video');
        for (const url of [
            'https://www.youtube.com/watch?v=test',
            'https://www.youtube.com/results?search_query=test',
        ]) {
            expect(computeActiveAttributes(settings, url)).not.toContain(
                'cln-yt-cust-feature-ads-feed-video'
            );
        }
        expect(
            computeActiveAttributes(
                settings,
                'https://www.youtube.com/watch?v=test'
            )
        ).toContain('cln-yt-cust-feature-auto-mute-ads');
        expect(
            computeActiveAttributes(
                settings,
                'https://www.youtube.com/feed/subscriptions'
            )
        ).not.toContain('cln-yt-cust-feature-auto-mute-ads');
        expect(DEFAULT_STORAGE.autoMuteAds.enabled).toBe(false);
    });
});

describe('current Home Shorts sections', () => {
    const mountShorts = (markup: string) => {
        document.body.innerHTML = markup;
        const style = document.createElement('style');
        style.textContent = styles;
        document.head.append(style);
        document.documentElement.setAttribute(
            'cln-yt-cust-feature-hide-shorts',
            'true'
        );
    };
    afterEach(() =>
        document.documentElement.removeAttribute(
            'cln-yt-cust-feature-hide-shorts'
        )
    );
    it('hides the saved rich-shelf Shorts section and Home sponsored cards while preserving normal videos and shelves', () => {
        mountShorts(
            readFileSync(
                path.join(
                    __dirname,
                    '../shared/utils/fixtures/home-feed-cleanup.html'
                ),
                'utf8'
            )
        );
        document.documentElement.setAttribute(
            'cln-yt-cust-feature-ads-feed-video',
            'true'
        );
        for (const id of ['home-shorts-section', 'home-sponsored-card']) {
            expect(
                window.getComputedStyle(document.getElementById(id)!).display
            ).toBe('none');
        }
        for (const id of ['home-regular-video', 'home-other-section']) {
            expect(
                window.getComputedStyle(document.getElementById(id)!).display
            ).not.toBe('none');
        }
    });
    it.each(['grid-shelf-view-model', 'ytd-reel-shelf-renderer'])(
        'also hides legacy Shorts models in %s',
        (tag) => {
            mountShorts(
                `<${tag} id="shorts"><ytm-shorts-lockup-view-model></ytm-shorts-lockup-view-model></${tag}>`
            );
            expect(
                window.getComputedStyle(document.getElementById('shorts')!)
                    .display
            ).toBe('none');
        }
    );
});
