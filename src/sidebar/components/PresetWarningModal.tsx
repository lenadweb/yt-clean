import React, {
    createContext,
    FC,
    ReactNode,
    useCallback,
    useContext,
    useRef,
    useState,
} from 'react';
import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
} from '@headlessui/react';
import { storage } from 'src/shared/storage';
import { Checkbox } from 'src/sidebar/components/Checkbox';
import { t } from 'src/shared/utils/i18n';

type ConfirmFn = () => Promise<boolean>;

const PresetWarningContext = createContext<ConfirmFn>(() =>
    Promise.resolve(true)
);

export const PresetWarningModalProvider: FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [open, setOpen] = useState(false);
    const [dontShowAgain, setDontShowAgain] = useState(false);
    const resolverRef = useRef<((value: boolean) => void) | null>(null);

    const confirm = useCallback<ConfirmFn>(
        () =>
            new Promise<boolean>((resolve) => {
                resolverRef.current = resolve;
                setDontShowAgain(false);
                setOpen(true);
            }),
        []
    );

    const settle = (value: boolean) => {
        if (value && dontShowAgain) {
            storage.update('presetWarningDismissed', true);
        }
        resolverRef.current?.(value);
        resolverRef.current = null;
        setOpen(false);
    };

    return (
        <PresetWarningContext.Provider value={confirm}>
            {children}
            <Transition appear show={open}>
                <Dialog
                    as="div"
                    className="relative z-50"
                    onClose={() => settle(false)}
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
                                    {t('preset_warning_title')}
                                </DialogTitle>
                                <p className="mb-4 text-sm font-light leading-snug text-black-200">
                                    {t('preset_warning_text')}
                                </p>
                                <div className="mb-5">
                                    <Checkbox
                                        label={t('preset_warning_dont_show')}
                                        checked={dontShowAgain}
                                        disabled={false}
                                        onChange={setDontShowAgain}
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => settle(false)}
                                        className="cursor-pointer rounded-full bg-black-600 px-4 py-2 text-sm text-white-100 transition hover:bg-black-500 active:scale-95"
                                    >
                                        {t('cancel')}
                                    </button>
                                    <button
                                        onClick={() => settle(true)}
                                        className="cursor-pointer rounded-full bg-red-accent px-4 py-2 text-sm text-white transition hover:opacity-90 active:scale-95"
                                    >
                                        {t('continue_action')}
                                    </button>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </Dialog>
            </Transition>
        </PresetWarningContext.Provider>
    );
};

export const usePresetWarning = (): ConfirmFn =>
    useContext(PresetWarningContext);
