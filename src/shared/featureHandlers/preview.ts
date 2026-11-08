const PREVIEW_SELECTOR = 'ytd-video-preview';

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
    document.addEventListener('play', pausePreview, true);
    document
        .querySelectorAll<HTMLVideoElement>(`${PREVIEW_SELECTOR} video`)
        .forEach((video) => {
            if (!video.paused) video.pause();
        });
};

export const disableHoverPreview = (): void => {
    document.removeEventListener('play', pausePreview, true);
};
