import React, { FC, useMemo } from 'react';
import canyonBg from '@assets/img/backgrounds/canyon.svg';
import catBg from '@assets/img/backgrounds/cat.svg';
import mountainsBg from '@assets/img/backgrounds/mountains.svg';
import roadBg from '@assets/img/backgrounds/road.svg';
import shipBg from '@assets/img/backgrounds/ship.svg';
import sunsetBg from '@assets/img/backgrounds/sunset.svg';
import tentBg from '@assets/img/backgrounds/tent.svg';
import waterfallBg from '@assets/img/backgrounds/waterfall.svg';
import wiresBg from '@assets/img/backgrounds/wires.svg';
import Button from 'src/blocked/components/Button';

type Colors = 'white3' | 'pinkLight30' | 'greyLight';

const backgrounds = [
    {
        background: canyonBg,
        buttonVariant: 'outlined',
        waterMarkColor: 'pinkLight30',
        watermarkPosition: 'left',
    },
    {
        background: catBg,
        buttonVariant: 'filled',
        waterMarkColor: 'pinkLight30',
        watermarkPosition: 'left',
    },
    {
        background: mountainsBg,
        buttonVariant: 'filled',
        waterMarkColor: 'pinkLight30',
        watermarkPosition: 'right',
    },
    {
        background: roadBg,
        buttonVariant: 'filled',
        waterMarkColor: 'greyLight',
        watermarkPosition: 'left',
    },
    {
        background: shipBg,
        buttonVariant: 'outlined',
        waterMarkColor: 'pinkLight30',
        watermarkPosition: 'left',
    },
    {
        background: sunsetBg,
        buttonVariant: 'filled',
        waterMarkColor: 'pinkLight30',
        watermarkPosition: 'right',
    },
    {
        background: tentBg,
        buttonVariant: 'filled',
        waterMarkColor: 'pinkLight30',
        watermarkPosition: 'left',
    },
    {
        background: waterfallBg,
        buttonVariant: 'filled',
        waterMarkColor: 'pinkLight30',
        watermarkPosition: 'left',
    },
    {
        background: wiresBg,
        buttonVariant: 'filled',
        waterMarkColor: 'greyLight',
        watermarkPosition: 'right',
    },
];

const Blocked: FC = () => {
    const backgroundConfig = useMemo(
        () => backgrounds[Math.floor(Math.random() * backgrounds.length)],
        []
    );

    const Background = backgroundConfig.background;

    return (
        <div className="flex h-screen w-full justify-center bg-cover bg-center">
            <Background className="absolute bottom-0 -z-10 w-full object-cover" />
            <div className="mt-[12vh] text-center">
                <h1 className="font-montserrat mb-3 whitespace-nowrap text-7xl font-extrabold uppercase leading-[90px] text-white">
                    Site unavailable
                </h1>
                <p className="text-white3 mx-auto my-6 max-w-[380px] text-sm leading-5">
                    Access to this site is temporarily restricted in order to
                    improve your productivity
                </p>
                {/*<Button*/}
                {/*    variant={backgroundConfig.buttonVariant}*/}
                {/*    onClick={onGoBackClick}*/}
                {/*    className="border-white3 text-white3 font-montserrat mx-auto h-[33px] w-[140px] text-xs"*/}
                {/*>*/}
                {/*    Go Back*/}
                {/*</Button>*/}

                <div
                    className={`text- absolute bottom-[41px] flex items-center gap-1${
                        backgroundConfig.waterMarkColor
                    } ${
                        backgroundConfig.watermarkPosition === 'left'
                            ? 'left-20'
                            : 'right-20'
                    }`}
                >
                    <div>Powered by</div>
                    <div className="font-chakra">SiteBlockade</div>
                </div>
            </div>
        </div>
    );
};

export default Blocked;
``;
