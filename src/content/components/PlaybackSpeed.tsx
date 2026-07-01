import React, { FC, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import cn from 'classnames';
import ShadowRoot from 'src/content/ShadowRoot';
import { useStorageValue } from 'src/shared/hooks/useStorage';
import { useOutsideClick } from 'src/shared/hooks/useOutsideClick';
import { parseSpeed } from 'src/shared/utils/yt';
import { t } from 'src/shared/utils/i18n';

const MIN_SPEED = 0.25;
const MAX_SPEED = 3;
const STEP = 0.05;
const PRESETS = [1, 1.25, 1.5, 2, 3];

const PLAYER_SELECTOR = '#movie_player, .html5-video-player';

const clampSpeed = (value: number): number =>
    Math.min(Math.max(value, MIN_SPEED), MAX_SPEED);

const roundSpeed = (value: number): number => Math.round(value * 100) / 100;

const formatPreset = (value: number): string =>
    value.toLocaleString(undefined, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 2,
    });

const isActive = (value: number, preset: number): boolean =>
    value.toFixed(2) === preset.toFixed(2);

const PlaybackSpeed: FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [playerEl, setPlayerEl] = useState<Element | null>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    useOutsideClick([triggerRef, panelRef], () => setIsOpen(false));

    const [speedControl, setSpeedControl] = useStorageValue('speedControl');
    const value = parseSpeed(speedControl.value);

    const setValue = (next: number) => {
        setSpeedControl({
            ...speedControl,
            value: roundSpeed(clampSpeed(next)).toString(),
        });
    };

    const toggle = () => {
        if (isOpen) {
            setIsOpen(false);
            return;
        }

        const host = (triggerRef.current?.getRootNode() as ShadowRoot | null)
            ?.host;
        setPlayerEl(
            host?.closest(PLAYER_SELECTOR) ??
                document.querySelector(PLAYER_SELECTOR)
        );
        setIsOpen(true);
    };

    const fillPercent = ((value - MIN_SPEED) / (MAX_SPEED - MIN_SPEED)) * 100;

    return (
        <div
            ref={triggerRef}
            className="relative top-[9px] flex size-12 items-center justify-center"
        >
            <button
                onClick={toggle}
                className="flex h-8 w-12 items-center justify-center rounded-full text-[13px] font-semibold leading-none text-white transition-colors hover:bg-white/10 hover:cursor-pointer"
            >
                {value}x
            </button>

            {isOpen &&
                playerEl &&
                ReactDOM.createPortal(
                    <ShadowRoot>
                        <div
                            ref={panelRef}
                            className="ytc-speed-panel w-[340px] overflow-hidden rounded-[12px] bg-black/60 text-white"
                            style={{
                                position: 'absolute',
                                right: '12px',
                                bottom: 'calc(var(--yt-delhi-bottom-controls-height, 72px) + 6px)',
                                zIndex: 6000,
                            }}
                        >
                            <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2.5">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    aria-label={t('playback_speed')}
                                    className="flex size-9 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-white/10"
                                >
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <path
                                            d="M15 18l-6-6 6-6"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                                <span className="text-[12px] font-normal">
                                    {t('playback_speed')}
                                </span>
                            </div>

                            <div className="py-4 text-center text-[17px] font-bold">
                                {value.toFixed(2)}x
                            </div>

                            <div className="flex items-center gap-3 px-4">
                                <button
                                    onClick={() =>
                                        setValue(roundSpeed(value - STEP))
                                    }
                                    aria-label="-"
                                    className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/10 text-[15px] leading-none transition-colors hover:bg-white/20"
                                >
                                    −
                                </button>
                                <input
                                    type="range"
                                    min={MIN_SPEED}
                                    max={MAX_SPEED}
                                    step={STEP}
                                    value={value}
                                    onChange={(event) =>
                                        setValue(Number(event.target.value))
                                    }
                                    className="ytc-speed-range h-1 flex-1 cursor-pointer appearance-none rounded-full"
                                    style={{
                                        background: `linear-gradient(to right, #fff ${fillPercent}%, rgba(255,255,255,0.3) ${fillPercent}%)`,
                                    }}
                                />
                                <button
                                    onClick={() =>
                                        setValue(roundSpeed(value + STEP))
                                    }
                                    aria-label="+"
                                    className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/10 text-[15px] leading-none transition-colors hover:bg-white/20"
                                >
                                    +
                                </button>
                            </div>

                            <div className="flex items-start justify-between gap-2 px-3 pb-4 pt-5">
                                {PRESETS.map((preset) => (
                                    <div
                                        key={preset}
                                        className="flex flex-1 flex-col items-center gap-1.5"
                                    >
                                        <button
                                            onClick={() => setValue(preset)}
                                            className={cn(
                                                'w-full cursor-pointer rounded-full px-2 py-2 text-[12px] transition-colors',
                                                isActive(value, preset)
                                                    ? 'bg-white text-black'
                                                    : 'bg-white/10 text-white hover:bg-white/20'
                                            )}
                                        >
                                            {formatPreset(preset)}
                                        </button>
                                        {preset === 1 && (
                                            <span className="text-[10px] text-white/60">
                                                {t('normal_speed')}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <style>{`
                                .ytc-speed-panel,
                                .ytc-speed-panel * {
                                    font-family: "Roboto", "Arial", sans-serif !important;
                                }
                                .ytc-speed-range::-webkit-slider-thumb {
                                    -webkit-appearance: none;
                                    appearance: none;
                                    width: 16px;
                                    height: 16px;
                                    border-radius: 9999px;
                                    background: #fff;
                                    cursor: pointer;
                                }
                                .ytc-speed-range::-moz-range-thumb {
                                    width: 16px;
                                    height: 16px;
                                    border: none;
                                    border-radius: 9999px;
                                    background: #fff;
                                    cursor: pointer;
                                }
                            `}</style>
                        </div>
                    </ShadowRoot>,
                    playerEl
                )}
        </div>
    );
};

export default PlaybackSpeed;
