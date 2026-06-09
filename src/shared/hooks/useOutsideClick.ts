import { RefObject, useEffect } from 'react';

export const useOutsideClick = (
    ref: RefObject<Element | null> | RefObject<Element | null>[],
    callback: () => void
): void => {
    useEffect(() => {
        function handleClickOutside(e: Event): void {
            const path = e.composedPath?.() || [];

            if (Array.isArray(ref)) {
                const isOutside = ref.every(
                    (r) => r.current && !path.includes(r.current)
                );
                if (isOutside) callback();
                return;
            }

            if (ref.current && !path.includes(ref.current)) {
                callback();
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref, callback]);
};
