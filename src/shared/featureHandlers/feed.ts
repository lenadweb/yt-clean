import { dispatchEnabled } from 'src/shared/utils/events';
import { INFINITE_FEED_EVENT } from 'src/shared/utils/infiniteFeed';

export const syncInfiniteFeed = (
    _value: string | undefined,
    enabled: boolean
): void => dispatchEnabled(INFINITE_FEED_EVENT, enabled);
