import React, { FC, useEffect } from 'react';
import background from '@assets/img/backgrounds/waterfall.png';
import Button from 'src/blocked/components/Button';
import { useStorage, useStorageValue } from 'src/shared/hooks/useStorage';

const onGoBackClick = () => {
    window.history.go(-2);
};

const Blocked: FC = () => {
    const [dailyTimeLimit] = useStorageValue('dailyTimeLimit');
    const onClick = async () => {
        const window = await chrome.windows.getCurrent();
        if (window.id) {
            chrome.sidePanel.open({ windowId: window.id });
        }
    };
    useEffect(() => {
        chrome.runtime
            .sendMessage({ type: 'checkLimit' })
            .then((isTimeSpent) => {
                if (!isTimeSpent) {
                    window.location.href = 'https://www.youtube.com';
                }
            });
    }, [dailyTimeLimit]);
    return (
        <div
            className="relative flex min-h-screen w-full justify-center bg-cover bg-center bg-no-repeat px-4"
            style={{
                backgroundImage: `url(${background})`,
            }}
        >
            <div className="mt-[4%] flex flex-col justify-center self-baseline">
                <h1 className="font-montserrat mb-8 whitespace-nowrap text-7xl font-extrabold uppercase leading-[90px] text-white">
                    Site unavailable
                </h1>
                <div className="m-auto flex gap-4 rounded-2xl bg-[#00000086] px-8 py-5 backdrop-blur-2xl">
                    <Button variant="outlined" onClick={onGoBackClick}>
                        Go back
                    </Button>
                    <Button variant="filled" onClick={onClick}>
                        Change Settings
                    </Button>
                </div>
            </div>

            <div className="absolute bottom-6 left-6 flex items-center gap-1 text-xs  text-white/60">
                <span>Powered by</span>
                <span className="font-semibold">YouTube Clean</span>
            </div>
        </div>
    );
};

export default Blocked;
