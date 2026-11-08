import { normalizeTitle } from 'src/shared/utils/originalTitles';

type TitleSnapshot = {
    videoId: string;
    children: Node[];
    titleAttribute: string | null;
    replacement: Text;
    text: string;
};

const ownsContent = (element: Element, snapshot: TitleSnapshot): boolean =>
    element.childNodes.length === 1 &&
    element.firstChild === snapshot.replacement &&
    snapshot.replacement.data === snapshot.text;

export class TitleReplacements {
    private readonly snapshots = new Map<Element, TitleSnapshot>();

    apply(element: Element, videoId: string, original: string): void {
        const previous = this.snapshots.get(element);
        if (previous && ownsContent(element, previous)) {
            // A recycled card can acquire its new href before YouTube paints
            // its new title. Do not save our old replacement as its translation.
            return;
        }
        if (previous) {
            if (previous.videoId === videoId)
                this.restoreAttribute(element, previous);
            this.snapshots.delete(element);
        }
        if (normalizeTitle(element.textContent ?? '') === original) return;

        const replacement = document.createTextNode(original);
        const snapshot: TitleSnapshot = {
            videoId,
            children: Array.from(element.childNodes),
            titleAttribute: element.getAttribute('title'),
            replacement,
            text: original,
        };
        this.snapshots.set(element, snapshot);
        element.replaceChildren(replacement);
        if (snapshot.titleAttribute !== null)
            element.setAttribute('title', original);
    }

    prune(): void {
        this.snapshots.forEach((_, element) => {
            if (!element.isConnected) this.snapshots.delete(element);
        });
    }

    restore(targets: Map<Element, string>): void {
        this.snapshots.forEach((snapshot, element) => {
            if (
                !element.isConnected ||
                targets.get(element) !== snapshot.videoId
            )
                return;
            if (ownsContent(element, snapshot))
                element.replaceChildren(...snapshot.children);
            this.restoreAttribute(element, snapshot);
        });
        this.snapshots.clear();
    }

    private restoreAttribute(element: Element, snapshot: TitleSnapshot): void {
        if (
            snapshot.titleAttribute !== null &&
            element.getAttribute('title') === snapshot.text
        ) {
            element.setAttribute('title', snapshot.titleAttribute);
        }
    }
}
