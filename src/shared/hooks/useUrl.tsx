import { useEffect, useState } from 'react';

export function useUrl() {
    const [href, setHref] = useState(() => window.location.href);

    useEffect(() => {
        const observer = new MutationObserver(() => {
            if (window.location.href !== href) {
                setHref(window.location.href);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        return () => observer.disconnect();
    }, [href]);

    return href;
}
