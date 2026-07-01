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
import { getFeatureSetting, toFeatureId } from 'src/shared/storage/config';
import { MANAGED_FEATURE_IDS, PRESET_DEFAULTS } from 'src/shared/presets';
import { t } from 'src/shared/utils/i18n';
import ResetIcon from 'src/assets/icons/reset.svg';

const ResetPresetLink: FC = () => {
    const [settings] = useStorage();
    const [open, setOpen] = useState(false);

    const defaults = PRESET_DEFAULTS[settings.activePreset];
    const isModified = MANAGED_FEATURE_IDS.some(
        (id) =>
            Boolean(getFeatureSetting(settings, id)?.enabled) !==
            Boolean(defaults[toFeatureId(id)]?.enabled)
    );

    const confirmReset = () => {
        storage.resetActivePreset();
        setOpen(false);
    };

    if (!settings.isEnabled || !isModified) return null;

    return (
        <>
            <div className="group relative flex">
                <button
                    onClick={() => setOpen(true)}
                    aria-label={t('reset_preset')}
                    className="cursor-pointer text-black-400 transition-colors hover:text-white"
                >
                    <ResetIcon className="w-4" />
                </button>
                <div className="pointer-events-none absolute bottom-full right-0 z-10 mb-1.5 whitespace-nowrap rounded-lg bg-black-600 px-2 py-1 text-[10px] text-white-100 opacity-0 shadow-3xl transition-opacity duration-150 group-hover:opacity-100">
                    {t('reset_preset')}
                </div>
            </div>

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
        </>
    );
};

export default ResetPresetLink;
