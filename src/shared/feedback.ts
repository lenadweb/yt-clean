export const FEEDBACK_MESSAGE_TYPE = 'submit-feedback';
export const FEEDBACK_MAX_LENGTH = 5000;

export type FeedbackKind = 'problem' | 'feature';
export type FeedbackResult =
    { ok: true } | { ok: false; error: 'invalid' | 'unavailable' | 'network' };

export type FeedbackRequest = {
    type: typeof FEEDBACK_MESSAGE_TYPE;
    kind: FeedbackKind;
    message: string;
};

export const isFeedbackRequest = (value: unknown): value is FeedbackRequest => {
    if (!value || typeof value !== 'object') return false;
    const request = value as Partial<FeedbackRequest>;
    return (
        request.type === FEEDBACK_MESSAGE_TYPE &&
        (request.kind === 'problem' || request.kind === 'feature') &&
        typeof request.message === 'string' &&
        request.message.trim().length > 0 &&
        request.message.length <= FEEDBACK_MAX_LENGTH
    );
};

export const submitFeedback = async (
    kind: FeedbackKind,
    message: string
): Promise<FeedbackResult> => {
    try {
        return await chrome.runtime.sendMessage({
            type: FEEDBACK_MESSAGE_TYPE,
            kind,
            message,
        } satisfies FeedbackRequest);
    } catch {
        return { ok: false, error: 'network' };
    }
};
