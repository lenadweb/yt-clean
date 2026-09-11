import {
    FEEDBACK_MESSAGE_TYPE,
    FeedbackResult,
    isFeedbackRequest,
} from 'src/shared/feedback';

const projectToken = process.env.VITE_POSTHOG_PROJECT_TOKEN?.trim();
const host = process.env.VITE_POSTHOG_HOST || 'https://eu.i.posthog.com';

export const sendFeedback = async (
    request: unknown
): Promise<FeedbackResult> => {
    if (!isFeedbackRequest(request)) return { ok: false, error: 'invalid' };
    if (!projectToken) return { ok: false, error: 'unavailable' };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
        const message = request.message.trim();
        const response = await fetch(`${host}/i/v0/e/`, {
            method: 'POST',
            // PostHog allows CORS; no additional host permissions are needed.
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'omit',
            referrerPolicy: 'no-referrer',
            signal: controller.signal,
            body: JSON.stringify({
                api_key: projectToken,
                event:
                    request.kind === 'problem'
                        ? 'problem_reported'
                        : 'feature_requested',
                // Each report is independent; no persistent user identifier.
                distinct_id: crypto.randomUUID(),
                properties: {
                    message,
                    message_length: message.length,
                    feedback_type: request.kind,
                    app: 'youtube-clean',
                    app_version: chrome.runtime.getManifest().version,
                    context: 'sidebar',
                    $process_person_profile: false,
                    $geoip_disable: true,
                },
            }),
        });
        if (!response.ok) return { ok: false, error: 'network' };
        if (response.status === 204) return { ok: true };
        const body: unknown = await response.json();
        // Capture uses "Ok" today; older servers return numeric status 1.
        if (
            !body ||
            typeof body !== 'object' ||
            !('status' in body) ||
            (body.status !== 'Ok' && body.status !== 1)
        ) {
            return { ok: false, error: 'network' };
        }
        return { ok: true };
    } catch {
        return { ok: false, error: 'network' };
    } finally {
        clearTimeout(timeout);
    }
};

export const registerFeedbackListener = (): void => {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request?.type !== FEEDBACK_MESSAGE_TYPE) return;
        // Only the extension's own settings page can submit reports.
        if (
            sender.id !== chrome.runtime.id ||
            sender.url !== chrome.runtime.getURL('sidebar.html')
        ) {
            sendResponse({
                ok: false,
                error: 'invalid',
            } satisfies FeedbackResult);
            return;
        }
        void sendFeedback(request).then(sendResponse);
        return true;
    });
};
