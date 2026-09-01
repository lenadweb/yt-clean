import React, { FC, useState } from 'react';
import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
} from '@headlessui/react';
import { I18nKey } from 'src/shared/types/config';
import { t } from 'src/shared/utils/i18n';

type Props = {
    title: I18nKey;
    hint: I18nKey;
};

export const HintModal: FC<Props> = ({ title, hint }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                aria-label={t('about_this_setting')}
                title={t('about_this_setting')}
                onClick={() => setOpen(true)}
                className="flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-full border border-current text-[10px] leading-none opacity-60 transition hover:opacity-100 active:scale-95"
            >
                ?
            </button>
            <Transition appear show={open}>
                <Dialog
                    as="div"
                    className="relative z-50"
                    onClose={() => setOpen(false)}
                >
                    <TransitionChild
                        enter="transition duration-200 ease-out"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition duration-150 ease-in"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/60" />
                    </TransitionChild>

                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <TransitionChild
                            enter="transition duration-200 ease-out"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="transition duration-150 ease-in"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="flex max-h-[80vh] w-full max-w-[320px] flex-col rounded-3xl bg-black-700 p-5 text-white-100 shadow-3xl">
                                <DialogTitle className="mb-3 text-base font-medium">
                                    {t(title)}
                                </DialogTitle>
                                <p className="mb-5 overflow-y-auto whitespace-pre-line text-sm font-light leading-snug text-black-200">
                                    {t(hint)}
                                </p>
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => setOpen(false)}
                                        className="cursor-pointer rounded-full bg-black-600 px-4 py-2 text-sm text-white-100 transition hover:bg-black-500 active:scale-95"
                                    >
                                        {t('close')}
                                    </button>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};
