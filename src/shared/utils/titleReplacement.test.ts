import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TitleReplacements } from 'src/shared/utils/titleReplacement';

// Keep node identity and listeners observable without serializing markup.
class TextNode {
    constructor(public data: string) {}
    get textContent() {
        return this.data;
    }
}
class TitleElement extends EventTarget {
    isConnected = true;
    constructor(
        public childNodes: (TextNode | TitleElement)[],
        public title: string | null = null
    ) {
        super();
    }
    get firstChild() {
        return this.childNodes[0] ?? null;
    }
    get textContent(): string {
        return this.childNodes.map((node) => node.textContent).join('');
    }
    getAttribute() {
        return this.title;
    }
    setAttribute(_name: string, value: string) {
        this.title = value;
    }
    replaceChildren(...children: (TextNode | TitleElement)[]) {
        this.childNodes = children;
    }
}
const element = (value: TitleElement) => value as unknown as Element;

describe('original title restoration', () => {
    let replacements: TitleReplacements;
    beforeEach(() => {
        vi.stubGlobal('document', {
            createTextNode: (value: string) => new TextNode(value),
        });
        replacements = new TitleReplacements();
    });
    afterEach(() => vi.unstubAllGlobals());

    it('restores the exact original children, listeners and title attribute', () => {
        const span = new TitleElement([new TextNode('Translated')]);
        const click = vi.fn();
        span.addEventListener('click', click);
        const title = new TitleElement([span], 'Translated tooltip');
        replacements.apply(element(title), 'video', 'Original');
        replacements.apply(element(title), 'video', 'Original');
        expect(title.textContent).toBe('Original');
        expect(title.title).toBe('Original');
        replacements.restore(new Map([[element(title), 'video']]));
        expect(title.childNodes).toEqual([span]);
        expect(title.firstChild).toBe(span);
        expect(title.title).toBe('Translated tooltip');
        span.dispatchEvent(new Event('click'));
        expect(click).toHaveBeenCalledTimes(1);
    });

    it('does not add a tooltip when there was none', () => {
        const title = new TitleElement([new TextNode('Translated')]);
        replacements.apply(element(title), 'video', 'Original');
        replacements.restore(new Map([[element(title), 'video']]));
        expect(title.title).toBeNull();
    });

    it('preserves content and attributes changed by YouTube after replacement', () => {
        const title = new TitleElement(
            [new TextNode('Translated')],
            'Old tooltip'
        );
        replacements.apply(element(title), 'video', 'Original');
        const updated = new TextNode('Updated by YouTube');
        title.replaceChildren(updated);
        title.title = 'New tooltip';
        replacements.restore(new Map([[element(title), 'video']]));
        expect(title.firstChild).toBe(updated);
        expect(title.title).toBe('New tooltip');
    });

    it('never restores the old video title into a recycled card', () => {
        const title = new TitleElement([new TextNode('First translation')]);
        replacements.apply(element(title), 'first', 'First original');
        replacements.apply(element(title), 'second', 'Second original');
        title.replaceChildren(new TextNode('Second translation'));
        replacements.apply(element(title), 'second', 'Second original');
        replacements.restore(new Map([[element(title), 'second']]));
        expect(title.textContent).toBe('Second translation');
    });

    it('leaves a newly recycled card alone when disabled before repaint', () => {
        const title = new TitleElement([new TextNode('First translation')]);
        replacements.apply(element(title), 'first', 'First original');
        replacements.restore(new Map([[element(title), 'second']]));
        expect(title.textContent).toBe('First original');
    });
});
