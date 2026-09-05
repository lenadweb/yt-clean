import React from 'react';
import FeatureCompareScene from 'src/promo/components/FeatureCompareScene';
import { NavigationMock } from 'src/promo/components/FeatureMocks';

const NavigationScene = () => (
    <FeatureCompareScene
        title={
            <>
                Your sidebar. <strong>Your rules.</strong>
            </>
        }
        subtitle="Remove Trending, Music, Live, and Gaming from navigation."
        switches={['Hide Trending', 'Hide Music', 'Hide Live', 'Hide Gaming']}
        before={<NavigationMock />}
        after={<NavigationMock clean />}
        aligned
        compact
    />
);

export default NavigationScene;
