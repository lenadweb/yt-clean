import React, {
    createContext,
    FC,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import cn from 'classnames';

type ToastContextValue = {
    showToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue>({
    showToast: () => {},
});

const TOAST_DURATION = 6000;

export const ToastProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [message, setMessage] = useState<string | null>(null);
    const [visible, setVisible] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const showToast = useCallback((text: string) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setMessage(text);
        setVisible(true);
        timerRef.current = setTimeout(() => setVisible(false), TOAST_DURATION);
    }, []);

    useEffect(
        () => () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        },
        []
    );

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-3">
                <div
                    className={cn(
                        'pointer-events-auto max-w-[320px] rounded-2xl border border-amber-500/40 bg-black-700 px-4 py-3 text-xs leading-snug text-white-100 shadow-3xl transition-all duration-200',
                        visible
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-4 opacity-0'
                    )}
                >
                    {message}
                </div>
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = (): ToastContextValue => useContext(ToastContext);
