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
import { t } from 'src/shared/utils/i18n';

type ConfirmFn = () => Promise<boolean>;

const ExperimentalConfirmContext = createContext<ConfirmFn>(() =>
    Promise.resolve(true)
);

export const ExperimentalModalProvider: FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [open, setOpen] = useState(false);
    const resolverRef = useRef<((value: boolean) => void) | null>(null);

    const confirm = useCallback<ConfirmFn>(
        () =>
            new Promise<boolean>((resolve) => {
                resolverRef.current = resolve;
                setOpen(true);
            }),
        []
    );

    const settle = (value: boolean) => {
        resolverRef.current?.(value);
        resolverRef.current = null;
        setOpen(false);
    };

    return (
        <ExperimentalConfirmContext.Provider value={confirm}>
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
                                <DialogTitle className="mb-3 flex items-center gap-2 text-base font-medium">
                                    {t('experimental_title')}
                                </DialogTitle>
                                <p className="mb-5 text-sm font-light leading-snug text-black-200">
                                    {t('experimental_notice')}
                                </p>
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
                                        {t('enable_anyway')}
                                    </button>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </Dialog>
            </Transition>
        </ExperimentalConfirmContext.Provider>
    );
};

export const useExperimentalConfirm = (): ConfirmFn =>
    useContext(ExperimentalConfirmContext);
