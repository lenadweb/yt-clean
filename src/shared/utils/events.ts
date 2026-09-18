export const dispatchEnabled = (eventName: string, enabled: boolean): void => {
    document.dispatchEvent(
        new CustomEvent(eventName, {
            detail: JSON.stringify({ enabled }),
        })
    );
};
