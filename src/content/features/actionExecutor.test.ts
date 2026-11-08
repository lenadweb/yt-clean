import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DomActionExecutor } from 'src/content/features/actionExecutor';
import {
    CachedElement,
    CustomAction,
    ElementActions,
} from 'src/shared/types/config';

const deferred = <T>() => {
    let resolve!: (value: T) => void;
    const promise = new Promise<T>((done) => {
        resolve = done;
    });
    return { promise, resolve };
};

describe('custom action lifecycle', () => {
    const url = 'https://www.youtube.com/watch?v=first';
    let executor: DomActionExecutor;
    let action: CustomAction;
    const run = (enabled: boolean, target = url) =>
        executor.run(
            {
                status: { enabled },
                actions: [action],
            },
            target
        );

    beforeEach(() => {
        vi.stubGlobal('document', {
            documentElement: {
                setAttribute: vi.fn(),
                removeAttribute: vi.fn(),
            },
        });
        executor = new DomActionExecutor();
        action = {
            action: ElementActions.custom,
            attr: 'test-feature',
            onDisable: vi.fn(),
        };
    });

    afterEach(() => vi.unstubAllGlobals());

    it('aborts pending enable and restores a result that completes after disable', async () => {
        const pending = deferred<CachedElement[]>();
        let signal!: AbortSignal;
        action.onEnable = vi.fn((value) => {
            signal = value;
            return pending.promise;
        });
        run(true);
        run(false);
        expect(signal.aborted).toBe(true);
        const nodes = [{}] as CachedElement[];
        pending.resolve(nodes);
        await pending.promise;
        expect(action.onDisable).toHaveBeenLastCalledWith(nodes);
    });

    it('keeps the original cache when an enabled action is run again on the same page', async () => {
        const nodes = [{}] as CachedElement[];
        action.onEnable = vi.fn(() => nodes);
        run(true);
        await Promise.resolve();
        run(true);
        run(false);
        run(false);
        expect(action.onEnable).toHaveBeenCalledTimes(1);
        expect(action.onDisable).toHaveBeenCalledTimes(1);
        expect(action.onDisable).toHaveBeenCalledWith(nodes);
    });

    it('cancels the old page before enabling on a new URL', () => {
        const signals: AbortSignal[] = [];
        action.onEnable = (signal) => {
            signals.push(signal);
        };
        run(true);
        run(true, 'https://www.youtube.com/watch?v=second');
        expect(signals.map((signal) => signal.aborted)).toEqual([true, false]);
        expect(action.onDisable).toHaveBeenCalledTimes(1);
    });

    it('disables an active handler when navigation leaves its scope', () => {
        action.urlRegExp = [/\/watch\?/];
        const enable = vi.fn();
        action.onEnable = enable;
        run(true);
        run(true, 'https://www.youtube.com/');
        expect(enable.mock.calls[0][0].aborted).toBe(true);
        expect(action.onDisable).toHaveBeenCalledTimes(1);
    });

    it('cleans up rejected enable work and allows a later retry', async () => {
        const error = vi.spyOn(console, 'error').mockImplementation(() => {});
        try {
            action.onEnable = vi
                .fn()
                .mockRejectedValueOnce(new Error('player replaced'))
                .mockResolvedValue(undefined);
            run(true);
            await Promise.resolve();
            expect(action.onDisable).toHaveBeenCalledTimes(1);
            run(true);
            expect(action.onEnable).toHaveBeenCalledTimes(2);
            await Promise.resolve();
        } finally {
            error.mockRestore();
        }
    });

    it('passes a disabled state to onChange when outside the declared URL scope', () => {
        const onChange = vi.fn();
        const feature = {
            id: 'watch-only',
            actions: [],
            urlRegExp: [/\/watch\?/],
            onChange,
        };
        const plan = {
            status: { enabled: true, value: '2' },
            actions: [],
            feature,
        };
        executor.run(plan, url);
        executor.run(plan, 'https://www.youtube.com/');
        expect(onChange.mock.calls).toEqual([
            ['2', true],
            ['2', false],
        ]);
    });
});
