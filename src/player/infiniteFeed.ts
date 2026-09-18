import { SETTINGS_CACHE_KEY } from 'src/shared/const';
import {
    collectVideoIds,
    getAppendedItems,
    getGridItems,
    hasContinuation,
    HOME_BROWSE_ID,
    INFINITE_FEED_EVENT,
    isBrowseUrl,
    isContinuationItem,
    isHomeFeedToken,
    isInfiniteFeedCached,
    parseContinuationBody,
    pickFreshItems,
} from 'src/shared/utils/infiniteFeed';
import {
    getVideoIdFromUrl,
    parseEnabledDetail,
} from 'src/shared/utils/originalTitles';

type FetchArgs = Parameters<typeof window.fetch>;

type HomeContinuation = {
    url: string;
    headers: Headers;
    context: unknown;
};

const CHIP_SELECTOR =
    'ytd-feed-filter-chip-bar-renderer :is(yt-chip-cloud-chip-renderer, chip-view-model)';
const SELECTED_CHIP_SELECTOR =
    '[selected], .iron-selected, [aria-selected="true"], :has([aria-selected="true"])';
const HOME_VIDEO_LINK_SELECTOR =
    'ytd-browse[page-subtype="home"] ytd-rich-item-renderer a[href*="/watch?v="]';

let enabled = false;
let isRefilling = false;

const readCachedSetting = (): boolean => {
    try {
        return isInfiniteFeedCached(
            window.localStorage.getItem(SETTINGS_CACHE_KEY)
        );
    } catch {
        return false;
    }
};

const isDefaultChipSelected = (): boolean => {
    const chips = Array.from(document.querySelectorAll(CHIP_SELECTOR));
    return chips.findIndex((chip) => chip.matches(SELECTED_CHIP_SELECTOR)) <= 0;
};

const getRequestUrl = (input: FetchArgs[0]): string =>
    input instanceof Request ? input.url : String(input);

const getRequestHeaders = (input: FetchArgs[0], init: FetchArgs[1]): Headers =>
    new Headers(
        init?.headers ?? (input instanceof Request ? input.headers : undefined)
    );

const readBodyBytes = async (
    input: FetchArgs[0],
    init: FetchArgs[1]
): Promise<ArrayBuffer | null> => {
    const body = init?.body;

    if (typeof body === 'string') {
        return new TextEncoder().encode(body).buffer as ArrayBuffer;
    }
    if (body instanceof ArrayBuffer) return body;
    if (ArrayBuffer.isView(body)) {
        return body.buffer.slice(
            body.byteOffset,
            body.byteOffset + body.byteLength
        ) as ArrayBuffer;
    }
    if (body instanceof Blob) return body.arrayBuffer();
    if (!body && input instanceof Request) return input.clone().arrayBuffer();

    return null;
};

const decodeBody = async (
    bytes: ArrayBuffer,
    headers: Headers
): Promise<string> => {
    if (headers.get('content-encoding')?.includes('gzip')) {
        const stream = new Blob([bytes])
            .stream()
            .pipeThrough(new DecompressionStream('gzip'));
        return new Response(stream).text();
    }

    return new TextDecoder().decode(bytes);
};

const readHomeContinuation = async (
    input: FetchArgs[0],
    init: FetchArgs[1]
): Promise<HomeContinuation | null> => {
    const url = getRequestUrl(input);
    if (!isBrowseUrl(url) || !isDefaultChipSelected()) return null;

    const headers = getRequestHeaders(input, init);
    const bytes = await readBodyBytes(input, init);
    if (!bytes) return null;

    const body = parseContinuationBody(await decodeBody(bytes, headers));
    if (!body || !isHomeFeedToken(body.continuation)) return null;

    return { url, headers, context: body.context };
};

const collectPageVideoIds = (): string[] =>
    Array.from(document.querySelectorAll(HOME_VIDEO_LINK_SELECTOR)).flatMap(
        (link) => {
            const id = getVideoIdFromUrl(link.getAttribute('href'));
            return id ? [id] : [];
        }
    );

const fetchHomeGrid = async (
    originalFetch: typeof window.fetch,
    { url, headers, context }: HomeContinuation
): Promise<unknown[]> => {
    const requestHeaders = new Headers(headers);
    requestHeaders.delete('content-encoding');
    requestHeaders.set('content-type', 'application/json');

    const response = await Reflect.apply(originalFetch, window, [
        url,
        {
            method: 'POST',
            headers: requestHeaders,
            body: JSON.stringify({ context, browseId: HOME_BROWSE_ID }),
            credentials: 'include',
        },
    ]);

    return response.ok ? getGridItems(await response.json()) : [];
};

const extendResponse = async (
    originalFetch: typeof window.fetch,
    response: Response,
    continuation: HomeContinuation
): Promise<Response> => {
    const data = (await response.clone().json()) as unknown;
    const items = getAppendedItems(data);
    if (!items || hasContinuation(items)) return response;

    const seen = new Set([...collectPageVideoIds(), ...collectVideoIds(items)]);
    const grid = await fetchHomeGrid(originalFetch, continuation);
    const fresh = pickFreshItems(grid, seen);
    const nextContinuation = grid.find(isContinuationItem);

    if (!fresh.length && !nextContinuation) return response;

    items.push(...fresh, ...(nextContinuation ? [nextContinuation] : []));

    const headers = new Headers(response.headers);
    headers.delete('content-length');
    headers.delete('content-encoding');

    return new Response(JSON.stringify(data), {
        status: response.status,
        statusText: response.statusText,
        headers,
    });
};

const patchFetch = (): void => {
    const originalFetch = window.fetch;

    window.fetch = async function patchedFetch(
        ...args: FetchArgs
    ): Promise<Response> {
        const continuation = enabled
            ? await readHomeContinuation(...args).catch(() => null)
            : null;
        const response = await Reflect.apply(originalFetch, window, args);

        if (!continuation || !response.ok || isRefilling) return response;

        isRefilling = true;
        try {
            return await extendResponse(originalFetch, response, continuation);
        } catch {
            return response;
        } finally {
            isRefilling = false;
        }
    };
};

export const initInfiniteFeed = (): void => {
    enabled = readCachedSetting();
    patchFetch();

    document.addEventListener(INFINITE_FEED_EVENT, (event) => {
        const value = parseEnabledDetail(
            event instanceof CustomEvent ? event.detail : null
        );
        if (value !== null) enabled = value;
    });
};
