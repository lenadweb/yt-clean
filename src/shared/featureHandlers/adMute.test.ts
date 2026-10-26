// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { disableAutoMuteAds, enableAutoMuteAds } from './adMute';

let player: HTMLElement;
let video: HTMLVideoElement;
beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML =
        '<ytd-player><div id="movie_player"><video class="html5-main-video"></video></div></ytd-player><video id="preview"></video>';
    player = document.getElementById('movie_player')!;
    video = player.querySelector('video')!;
    video.volume = 0.6;
});
afterEach(() => {
    disableAutoMuteAds();
    vi.useRealTimers();
    document.body.innerHTML = '';
});

describe('mute native ads and restore content audio', () => {
    it('leaves content and unrelated previews alone', async () => {
        enableAutoMuteAds();
        await vi.advanceTimersByTimeAsync(500);
        expect(video.muted).toBe(false);
        expect(video.volume).toBe(0.6);
        expect(
            (document.getElementById('preview') as HTMLVideoElement).muted
        ).toBe(false);
    });
    it('mutes an ad immediately without waiting for an available Skip button', () => {
        player.className = 'ad-showing';
        enableAutoMuteAds();
        expect(video.muted).toBe(true);
        expect(video.volume).toBe(0.6);
        expect(
            (document.getElementById('preview') as HTMLVideoElement).muted
        ).toBe(false);
    });
    it('restores audible content and retains volume changes made during an ad', async () => {
        player.className = 'ad-interrupting';
        enableAutoMuteAds();
        video.volume = 0.3;
        player.className = '';
        await vi.advanceTimersByTimeAsync(250);
        expect(video.muted).toBe(false);
        expect(video.volume).toBe(0.3);
    });
    it('keeps previously muted content muted after the ad ends', async () => {
        video.muted = true;
        player.className = 'ad-showing';
        enableAutoMuteAds();
        player.className = '';
        await vi.advanceTimersByTimeAsync(250);
        expect(video.muted).toBe(true);
    });
    it('restores audio and stops muting when the setting is disabled mid-ad', async () => {
        player.className = 'ad-showing';
        enableAutoMuteAds();
        disableAutoMuteAds();
        await vi.advanceTimersByTimeAsync(1000);
        expect(video.muted).toBe(false);
        expect(vi.getTimerCount()).toBe(0);
    });
    it('retains the original mute choice across replacement ad videos', async () => {
        player.className = 'ad-showing';
        enableAutoMuteAds();
        const next = document.createElement('video');
        next.muted = true;
        video.replaceWith(next);
        await vi.advanceTimersByTimeAsync(250);
        expect(video.muted).toBe(false);
        expect(next.muted).toBe(true);
        player.className = '';
        await vi.advanceTimersByTimeAsync(250);
        expect(next.muted).toBe(false);
    });
    it('restores the inherited mute state when content uses a replacement video', async () => {
        player.className = 'ad-showing';
        enableAutoMuteAds();
        const next = document.createElement('video');
        next.muted = true;
        video.replaceWith(next);
        player.className = '';
        await vi.advanceTimersByTimeAsync(250);
        expect(video.muted).toBe(false);
        expect(next.muted).toBe(false);
    });
    it('releases a removed player without leaving a muted video behind', async () => {
        player.className = 'ad-showing';
        enableAutoMuteAds();
        player.remove();
        await vi.advanceTimersByTimeAsync(250);
        expect(video.muted).toBe(false);
    });
    it('does not recapture its own forced mute when enabled again', async () => {
        player.className = 'ad-showing';
        enableAutoMuteAds();
        enableAutoMuteAds();
        expect(vi.getTimerCount()).toBe(1);
        player.className = '';
        await vi.advanceTimersByTimeAsync(250);
        expect(video.muted).toBe(false);
    });
    it('restores audio on page hide and resumes muting on a cached-page return', () => {
        player.className = 'ad-showing';
        enableAutoMuteAds();
        window.dispatchEvent(new Event('pagehide'));
        expect(video.muted).toBe(false);
        window.dispatchEvent(new Event('pageshow'));
        expect(video.muted).toBe(true);
    });
});
