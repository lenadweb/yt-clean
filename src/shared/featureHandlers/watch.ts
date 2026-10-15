export const updateWatchLayout = (): void => {
    // Let the new CSS layout settle before the player measures its container.
    window.requestAnimationFrame(() => {
        window.dispatchEvent(new Event('resize'));
    });
};
