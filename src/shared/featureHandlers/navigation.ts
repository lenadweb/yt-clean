import { getHomeRedirectUrl } from 'src/shared/utils/homeRedirect';

let observer: MutationObserver | null = null;
let redirecting = false;

const redirectHome = (): void => {
    if (!observer || redirecting) return;

    // The account button appears after the masthead has finished loading.
    // A guest's Sign in button must never send them to an empty subscriptions page.
    const signedIn = Boolean(
        document.querySelector('ytd-masthead #avatar-btn')
    );
    const target = getHomeRedirectUrl(window.location.href, signedIn);
    if (!target) return;

    redirecting = true;
    observer?.disconnect();
    // Replace Home in history so Back does not land on Home and redirect again.
    window.location.replace(target);
};

export const enableHomeRedirect = (): void => {
    if (observer || redirecting) return;

    observer = new MutationObserver(redirectHome);
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
    });
    redirectHome();
};

export const disableHomeRedirect = (): void => {
    observer?.disconnect();
    observer = null;
    redirecting = false;
};
