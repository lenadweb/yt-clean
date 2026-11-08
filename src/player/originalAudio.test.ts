import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
    ORIGINAL_AUDIO_EVENT,
    AudioTrack,
} from 'src/shared/utils/originalAudio';

describe('original audio application', () => {
    let documentMock: EventTarget;
    let windowMock: EventTarget;
    let current: AudioTrack;
    let tracks: AudioTrack[];
    let player: {
        getAvailableAudioTracks: () => AudioTrack[];
        getAudioTrack: () => AudioTrack;
        setAudioTrack: ReturnType<typeof vi.fn>;
        getVideoData: () => { video_id: string };
    };
    const original = { id: 'original', label: { name: 'Original' } };
    const dub = { id: 'dub', label: { name: 'Dubbed' } };
    const toggle = (enabled: boolean) =>
        documentMock.dispatchEvent(
            new CustomEvent(ORIGINAL_AUDIO_EVENT, {
                detail: JSON.stringify({ enabled }),
            })
        );

    beforeEach(async () => {
        vi.resetModules();
        vi.useFakeTimers();
        current = dub;
        tracks = [original, dub];
        player = {
            getAvailableAudioTracks: () => tracks,
            getAudioTrack: () => current,
            setAudioTrack: vi.fn((track: AudioTrack) => {
                current = track;
            }),
            getVideoData: () => ({ video_id: 'video' }),
        };
        documentMock = Object.assign(new EventTarget(), {
            getElementById: () => player,
            querySelector: () => null,
        });
        windowMock = Object.assign(new EventTarget(), {
            localStorage: { getItem: () => null },
            setInterval,
            clearInterval,
        });
        vi.stubGlobal('document', documentMock);
        vi.stubGlobal('window', windowMock);
        const { initOriginalAudio } = await import('src/player/originalAudio');
        initOriginalAudio();
    });

    afterEach(() => {
        toggle(false);
        vi.useRealTimers();
        vi.unstubAllGlobals();
    });

    it('reapplies on re-enable but respects manual track changes while enabled', () => {
        toggle(true);
        expect(current).toBe(original);
        current = dub;
        windowMock.dispatchEvent(new Event('yt-player-updated'));
        expect(current).toBe(dub);
        toggle(false);
        toggle(true);
        expect(current).toBe(original);
        expect(player.setAudioTrack).toHaveBeenCalledTimes(2);
    });

    it('retries a failed setAudioTrack instead of marking it successful', () => {
        player.setAudioTrack.mockImplementationOnce(() => {
            throw new Error('not ready');
        });
        toggle(true);
        expect(current).toBe(dub);
        vi.advanceTimersByTime(500);
        expect(current).toBe(original);
        expect(player.setAudioTrack).toHaveBeenCalledTimes(2);
        expect(vi.getTimerCount()).toBe(0);
    });

    it('waits for the original track when the track list is not ready', () => {
        tracks = [dub, { id: 'other' }];
        toggle(true);
        tracks = [original, dub];
        vi.advanceTimersByTime(500);
        expect(current).toBe(original);
    });

    it('stops retrying when disabled', () => {
        tracks = [dub];
        toggle(true);
        toggle(false);
        tracks = [original, dub];
        vi.advanceTimersByTime(10000);
        expect(player.setAudioTrack).not.toHaveBeenCalled();
        expect(vi.getTimerCount()).toBe(0);
    });
});
