import { describe, expect, it } from 'vitest';
import { createSpoofedPlayerBandwidth } from 'src/shared/utils/playerBandwidth';

describe('createSpoofedPlayerBandwidth', () => {
    it('updates the current string-encoded bandwidth data', () => {
        const result = JSON.parse(
            createSpoofedPlayerBandwidth(
                JSON.stringify({
                    data: JSON.stringify({
                        delay: 0.3,
                        stall: 4,
                        byterate: 100,
                        interruptions: [{ net: 12 }],
                    }),
                    expiration: 10,
                    creation: 5,
                }),
                1_000
            )
        );
        const data = JSON.parse(result.data);

        expect(data).toEqual({
            delay: 0,
            stall: 0,
            byterate: 50_000_000,
            interruptions: [{ net: 12 }],
        });
        expect(result.creation).toBe(1_000);
        expect(result.expiration).toBe(2_592_001_000);
    });

    it('preserves object-encoded data used by older player versions', () => {
        const result = JSON.parse(
            createSpoofedPlayerBandwidth(
                JSON.stringify({ data: { exponential: 20, linear: 30 } }),
                0
            )
        );

        expect(result.data).toEqual({
            exponential: 20,
            linear: 30,
            delay: 0,
            stall: 0,
            byterate: 50_000_000,
        });
    });
});
