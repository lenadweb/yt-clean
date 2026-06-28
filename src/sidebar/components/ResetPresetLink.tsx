import React, { FC, useState } from 'react';
import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
} from '@headlessui/react';
import { useStorage } from 'src/shared/hooks/useStorage';
import { storage } from 'src/shared/storage';
import { t } from 'src/shared/utils/i18n';

const ResetPresetLink: FC = () => {
    const [settings] = useStorage();
    const [open, setOpen] = useState(false);

    const confirmReset = () => {
        storage.resetActivePreset();
        setOpen(false);
    };

    return (
        <div className="mt-4 flex justify-center">
            <button
                onClick={() => setOpen(true)}
                disabled={!settings.isEnabled}
                className="cursor-pointer text-xs text-black-400 underline-offset-2 transition-colors hover:text-white hover:underline disabled:cursor-default disabled:opacity-50"
            >
                {t('reset_preset')}
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
                            <DialogPanel className="w-full max-w-[320px] rounded-3xl bg-black-700 p-5 text-white-100 shadow-3xl">
                                <DialogTitle className="mb-3 text-base font-medium">
                                    {t('reset_preset')}
                                </DialogTitle>
                                <p className="mb-5 text-sm font-light leading-snug text-black-200">
                                    {t('reset_confirm_text')}
                                </p>
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => setOpen(false)}
                                        className="cursor-pointer rounded-full bg-black-600 px-4 py-2 text-sm text-white-100 transition hover:bg-black-500 active:scale-95"
                                    >
                                        {t('cancel')}
                                    </button>
                                    <button
                                        onClick={confirmReset}
                                        className="cursor-pointer rounded-full bg-red-accent px-4 py-2 text-sm text-white transition hover:opacity-90 active:scale-95"
                                    >
                                        {t('reset_action')}
                                    </button>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default ResetPresetLink;
