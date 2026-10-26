// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { runInNewContext } from 'node:vm';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { findNativeSkipButton } from './nativeSkip';

let hit: Element | null;
const mount = (markup: string, adClass = 'ad-showing') => {
    document.body.innerHTML = `<div id="movie_player" class="${adClass}">${markup}</div>`;
    hit = document.querySelector('button');
    return hit as HTMLButtonElement;
};

beforeEach(() => {
    const rect = {
        left: 100,
        top: 100,
        right: 220,
        bottom: 140,
        width: 120,
        height: 40,
        x: 100,
        y: 100,
        toJSON: () => ({}),
    };
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(
        rect
    );
    vi.spyOn(HTMLElement.prototype, 'getClientRects').mockReturnValue([
        rect,
    ] as unknown as DOMRectList);
    document.elementFromPoint = vi.fn(() => hit);
});
afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
});

describe('available native Skip controls', () => {
    it('finds the sibling ad overlay from the saved YouTube layout', () => {
        document.body.innerHTML = readFileSync(
            path.join(__dirname, 'fixtures/native-skip-sibling.html'),
            'utf8'
        );
        hit = document.querySelector('button.ytp-skip-ad-button');
        expect(findNativeSkipButton()).toBe(hit);
    });
    it.each([
        'ytp-ad-skip-button',
        'ytp-ad-skip-button-modern',
        'ytp-skip-ad-button',
        'ytp-skip-ad-button-modern',
    ])('recognizes %s', (className) => {
        const button = mount(`<button class="${className}">Skip</button>`);
        expect(findNativeSkipButton()).toBe(button);
    });
    it('recognizes a current overlay button without a legacy player ad class', () => {
        const button = mount(
            '<div id="player-overlay-layout:t"><button id="skip-button:v">Skip</button></div>',
            ''
        );
        expect(findNativeSkipButton()).toBe(button);
    });
    it('does not click a button while inspecting it', () => {
        const button = mount(
            '<button class="ytp-skip-ad-button">Skip</button>'
        );
        const click = vi.spyOn(button, 'click');
        findNativeSkipButton();
        expect(click).not.toHaveBeenCalled();
    });
    it.each([
        'disabled',
        'aria-disabled="true"',
        'hidden',
        'inert',
        'aria-hidden="true"',
        'style="opacity:0"',
        'style="visibility:hidden"',
        'style="pointer-events:none"',
    ])('ignores an unavailable button: %s', (attributes) => {
        mount(`<button class="ytp-skip-ad-button" ${attributes}>Skip</button>`);
        expect(findNativeSkipButton()).toBeNull();
    });
    it('waits while an ancestor is transparent during the countdown', () => {
        mount(
            '<div style="opacity:0"><button class="ytp-skip-ad-button">Skip</button></div>'
        );
        expect(findNativeSkipButton()).toBeNull();
    });
    it('accepts YouTube overlay children that restore pointer interaction', () => {
        const button = mount(
            '<div class="ytp-ad-player-overlay-layout" style="pointer-events:none"><div class="ytp-ad-player-overlay-layout__skip-or-preview-container"><button class="ytp-skip-ad-button" style="pointer-events:auto">Skip</button></div></div>'
        );
        expect(findNativeSkipButton()).toBe(button);
    });
    it('accepts a visible child that overrides inherited visibility', () => {
        const button = mount(
            '<div style="visibility:hidden"><button class="ytp-skip-ad-button" style="visibility:visible">Skip</button></div>'
        );
        expect(findNativeSkipButton()).toBe(button);
    });
    it('does not click a button covered by another element', () => {
        mount(
            '<button class="ytp-skip-ad-button">Skip</button><div id="cover"></div>'
        );
        hit = document.getElementById('cover');
        expect(findNativeSkipButton()).toBeNull();
    });
    it('does not use a stale Skip control outside an ad', () => {
        mount('<button class="ytp-skip-ad-button">Skip</button>', '');
        expect(findNativeSkipButton()).toBeNull();
    });
    it('can run as a standalone expression in the worker page check', () => {
        const button = mount(
            '<button class="ytp-skip-ad-button">Skip</button>'
        );
        expect(
            runInNewContext(`(${findNativeSkipButton.toString()})()`, {
                document,
                window,
            })
        ).toBe(button);
    });
});
