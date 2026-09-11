import React, { FormEvent, useId, useRef, useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import {
    FEEDBACK_MAX_LENGTH,
    FeedbackKind,
    submitFeedback,
} from 'src/shared/feedback';
import { t } from 'src/shared/utils/i18n';

const buttonClass =
    'inline-flex min-h-10 items-center justify-center gap-2 cursor-pointer rounded-full px-5 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-default disabled:opacity-40';

const iconPaths = {
    flag: 'M4 21V4m0 0c5-4 11 4 16 0v11c-5 4-11-4-16 0',
    idea: 'M9 18h6m-5 3h4M8 14a6 6 0 1 1 8 0c-1 .8-1 1.5-1 2H9c0-.5 0-1.2-1-2Z',
    close: 'm6 6 12 12M6 18 18 6',
    check: 'm5 12 4 4L19 6',
    send: 'm21 3-7 18-4-7-7-4 18-7Zm0 0L10 14',
    info: 'M12 8h.01M12 11v5m9-4a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
};

const ReportIcon = ({
    name,
    className = 'size-4',
}: {
    name: keyof typeof iconPaths;
    className?: string;
}) => (
    <svg
        className={`${className} shrink-0`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d={iconPaths[name]}
        />
    </svg>
);

export default function FeedbackModal() {
    const [open, setOpen] = useState(false);
    const [kind, setKind] = useState<FeedbackKind>('problem');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<
        'idle' | 'sending' | 'success' | 'error' | 'unavailable'
    >('idle');
    const sending = useRef(false);
    const id = useId();

    const close = () => {
        if (sending.current) return;
        setOpen(false);
        setStatus('idle');
    };

    const send = async (event: FormEvent) => {
        event.preventDefault();
        if (sending.current || !message.trim()) return;
        sending.current = true;
        setStatus('sending');
        try {
            const result = await submitFeedback(kind, message.trim());
            if (result?.ok) {
                setStatus('success');
                setMessage('');
            } else {
                setStatus(
                    result?.error === 'unavailable' ? 'unavailable' : 'error'
                );
            }
        } catch {
            setStatus('error');
        } finally {
            sending.current = false;
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="flex cursor-pointer items-center justify-center gap-1.5 rounded py-2 text-sm text-white/60 transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
                <ReportIcon name="flag" />
                {t('feedback')}
            </button>
            <Dialog open={open} onClose={close} className="relative z-50">
                <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-3">
                    <DialogPanel className="flex max-h-[calc(100dvh-24px)] w-full max-w-[380px] flex-col overflow-hidden rounded-3xl bg-black-700 text-white-100 shadow-xl ring-1 ring-white/10">
                        <div className="flex shrink-0 items-start justify-between gap-3 p-5">
                            <DialogTitle className="min-w-0 pt-1 text-[20px] font-medium leading-snug">
                                {t('feedback_title')}
                            </DialogTitle>
                            <button
                                type="button"
                                onClick={close}
                                disabled={status === 'sending'}
                                aria-label={t('close')}
                                className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-black-600 text-black-200 transition-colors hover:bg-black-500 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-default disabled:opacity-40"
                            >
                                <ReportIcon name="close" />
                            </button>
                        </div>
                        {status === 'success' ? (
                            <div className="overflow-y-auto px-5 pb-5">
                                <div
                                    role="status"
                                    className="flex flex-col items-center gap-4 py-6 text-center"
                                >
                                    <span className="flex size-12 items-center justify-center rounded-full bg-black-600 text-white">
                                        <ReportIcon
                                            name="check"
                                            className="size-6"
                                        />
                                    </span>
                                    <p className="text-sm leading-relaxed text-black-200">
                                        {t('feedback_success')}
                                    </p>
                                </div>
                                <button
                                    autoFocus
                                    type="button"
                                    onClick={close}
                                    className={`${buttonClass} w-full bg-black-600 hover:bg-black-500`}
                                >
                                    {t('close')}
                                </button>
                            </div>
                        ) : (
                            <form
                                onSubmit={send}
                                aria-busy={status === 'sending'}
                                className="flex min-h-0 flex-col"
                            >
                                <div className="min-h-0 overflow-y-auto px-5 pb-5">
                                    <fieldset
                                        disabled={status === 'sending'}
                                        className="mb-5 grid grid-cols-2 gap-1 rounded-2xl bg-background p-1 disabled:opacity-60"
                                    >
                                        <legend className="sr-only">
                                            {t('feedback_title')}
                                        </legend>
                                        {(['problem', 'feature'] as const).map(
                                            (value) => (
                                                <label
                                                    key={value}
                                                    className="relative min-w-0 cursor-pointer"
                                                >
                                                    <input
                                                        type="radio"
                                                        name={`${id}-kind`}
                                                        value={value}
                                                        checked={kind === value}
                                                        onChange={() =>
                                                            setKind(value)
                                                        }
                                                        className="peer sr-only"
                                                    />
                                                    <span className="flex h-full min-h-10 items-center justify-center gap-2 rounded-xl px-2 py-2 text-center text-[12px] font-medium leading-snug text-black-200 transition-colors hover:bg-black-600 peer-checked:bg-red-accent peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-white peer-disabled:cursor-default">
                                                        <ReportIcon
                                                            name={
                                                                value ===
                                                                'problem'
                                                                    ? 'flag'
                                                                    : 'idea'
                                                            }
                                                        />
                                                        {t(
                                                            value === 'problem'
                                                                ? 'feedback_problem'
                                                                : 'feedback_feature'
                                                        )}
                                                    </span>
                                                </label>
                                            )
                                        )}
                                    </fieldset>
                                    <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                                        <label
                                            htmlFor={`${id}-message`}
                                            className="text-sm font-medium"
                                        >
                                            {t('feedback_message')}
                                        </label>
                                        <span
                                            id={`${id}-count`}
                                            className="text-[11px] tabular-nums text-black-200"
                                        >
                                            {message.length} /{' '}
                                            {FEEDBACK_MAX_LENGTH}
                                        </span>
                                    </div>
                                    <textarea
                                        id={`${id}-message`}
                                        data-autofocus
                                        value={message}
                                        onChange={(event) => {
                                            setMessage(event.target.value);
                                            if (status !== 'sending')
                                                setStatus('idle');
                                        }}
                                        required
                                        maxLength={FEEDBACK_MAX_LENGTH}
                                        disabled={status === 'sending'}
                                        rows={6}
                                        placeholder={t('feedback_placeholder')}
                                        aria-describedby={`${id}-privacy ${id}-count`}
                                        className="block min-h-40 w-full resize-y rounded-2xl border border-black-600 bg-background p-4 text-sm leading-relaxed text-white caret-red-accent transition-colors placeholder:text-black-200/70 hover:border-black-500 focus:border-black-400 focus:outline-none disabled:opacity-60"
                                    />
                                    {(status === 'error' ||
                                        status === 'unavailable') && (
                                        <div
                                            role="alert"
                                            className="mt-3 rounded-xl bg-black-600 p-3 text-[12px] leading-relaxed text-white-100"
                                        >
                                            <p>
                                                {t(
                                                    status === 'unavailable'
                                                        ? 'feedback_unavailable'
                                                        : 'feedback_error'
                                                )}
                                            </p>
                                            <a
                                                href="https://github.com/lenadweb/yt-clean/issues/new"
                                                target="_blank"
                                                rel="noreferrer"
                                                className="mt-2 inline-block font-medium underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-white"
                                            >
                                                {t('view_on_github')}
                                            </a>
                                        </div>
                                    )}
                                    <div className="mt-3 flex items-start gap-2 text-black-200">
                                        <ReportIcon
                                            name="info"
                                            className="mt-0.5 size-3.5"
                                        />
                                        <p
                                            id={`${id}-privacy`}
                                            className="text-[11px] leading-relaxed"
                                        >
                                            {t('feedback_privacy')}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-black-600 px-5 py-4">
                                    <button
                                        type="button"
                                        onClick={close}
                                        disabled={status === 'sending'}
                                        className={`${buttonClass} bg-black-600 hover:bg-black-500`}
                                    >
                                        {t('cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={
                                            status === 'sending' ||
                                            !message.trim()
                                        }
                                        className={`${buttonClass} bg-red-accent text-white enabled:hover:opacity-90`}
                                    >
                                        <span role="status">
                                            {t(
                                                status === 'sending'
                                                    ? 'feedback_sending'
                                                    : 'feedback_send'
                                            )}
                                        </span>
                                        <ReportIcon name="send" />
                                    </button>
                                </div>
                            </form>
                        )}
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    );
}
