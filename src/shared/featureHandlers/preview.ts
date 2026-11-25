const PREVIEW_SELECTOR = 'ytd-video-preview';

const THUMBNAIL_SELECTOR = [
    'ytd-thumbnail',
    'ytd-playlist-thumbnail',
    'yt-thumbnail-view-model',
    '.yt-lockup-view-model__content-image',
    '.ytLockupViewModelContentImage',
].join(', ');

const HOVER_EVENTS = [
    'mouseover',
    'mouseenter',
    'mousemove',
    'pointerover',
    'pointerenter',
    'pointermove',
];

const blockHover = (event: Event): void => {
    const target = event.target;
    if (
        target instanceof Element &&
        target.closest(THUMBNAIL_SELECTOR) &&
        !target.closest('button')
    ) {
        event.stopImmediatePropagation();
    }
};

const pausePreview = (event: Event): void => {
    const video = event.target;
    if (
        video instanceof HTMLVideoElement &&
        video.closest(PREVIEW_SELECTOR) &&
        !video.paused
    ) {
        video.pause();
    }
};

export const enableHoverPreview = (): void => {
    HOVER_EVENTS.forEach((type) =>
        window.addEventListener(type, blockHover, true)
    );
    document.addEventListener('play', pausePreview, true);
    document
        .querySelectorAll<HTMLVideoElement>(`${PREVIEW_SELECTOR} video`)
        .forEach((video) => {
            if (!video.paused) video.pause();
        });
};

export const disableHoverPreview = (): void => {
    HOVER_EVENTS.forEach((type) =>
        window.removeEventListener(type, blockHover, true)
    );
    document.removeEventListener('play', pausePreview, true);
};
