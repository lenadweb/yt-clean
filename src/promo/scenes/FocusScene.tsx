import React from 'react';
import FeatureCompareScene from 'src/promo/components/FeatureCompareScene';
import { WatchPageMock } from 'src/promo/components/FeatureMocks';

const FocusScene = () => (
    <FeatureCompareScene
        title={
            <>
                Watch the video. <strong>Not the clutter.</strong>
            </>
        }
        subtitle="Hide comments, live chat, and action buttons when you want to focus."
        switches={['Hide Comments', 'Hide Live Chat', 'Hide Action Buttons']}
        before={<WatchPageMock />}
        after={<WatchPageMock clean />}
        compact
    />
);

export default FocusScene;
