import { useEffect, useState } from 'react';
import { getCurrentUrl, onUrlChange } from 'src/shared/utils/navigation';

export function useUrl() {
    const [href, setHref] = useState(getCurrentUrl);

    useEffect(() => onUrlChange(setHref), []);

    return href;
}
