import React from 'react';
import { StorageProvider } from 'src/shared/hooks/useStorage';
import { ExperimentalModalProvider } from 'src/sidebar/components/ExperimentalModal';
import { PresetWarningModalProvider } from 'src/sidebar/components/PresetWarningModal';
import { SettingsAccordion } from 'src/sidebar/components/SettingsAccordion';
import { CATEGORIES } from 'src/shared/featureConfig';
import { DEFAULT_STORAGE, toFeatureId } from 'src/shared/storage/config';
import type { SettingsState, StorageState } from 'src/shared/storage/config';
import { setI18nMockMessages } from 'src/shared/utils/i18n';
import englishMessages from 'src/_locales/en/messages.json';

type Choice = {
    category: string;
    section: string;
    limit: number;
    off?: number;
};

const PICKS: Choice[] = [
    {
        category: 'feed_and_recommendations',
        section: 'content_blocks',
        limit: 4,
    },
    { category: 'video_page', section: 'video_page_elements', limit: 4 },
    { category: 'sidebar', section: 'explore', limit: 4 },
    {
        category: 'video_playback_and_channel',
        section: 'player',
        limit: 4,
        off: 3,
    },
    { category: 'feed_and_recommendations', section: 'ads', limit: 4, off: 3 },
    { category: 'basic_template', section: 'search_bar', limit: 3 },
];

const cards = PICKS.map(({ category, section, limit, off }) => {
    const found = CATEGORIES.find((item) => item.title === category)!;
    const source = found.sections.find((item) => item.title === section)!;

    return {
        title: found.title,
        section: { ...source, features: source.features.slice(0, limit) },
        off,
    };
});

const overrides = Object.fromEntries(
    cards.flatMap(({ section, off }) =>
        section.features.map((feature, index) => [
            toFeatureId(feature.id),
            { enabled: index !== off },
        ])
    )
) as Partial<SettingsState>;

const settings: StorageState = {
    ...DEFAULT_STORAGE,
    isEnabled: true,
    activePreset: 'custom',
    presetWarningDismissed: true,
    ...overrides,
};

const SettingsStage = () => {
    setI18nMockMessages(englishMessages);

    return (
        <StorageProvider mockSettings={settings}>
            <ExperimentalModalProvider>
                <PresetWarningModalProvider>
                    <div className="power__grid">
                        {cards.map(({ title, section }) => (
                            <SettingsAccordion
                                key={section.title}
                                defaultOpen
                                title={title}
                                sections={[section]}
                            />
                        ))}
                    </div>
                </PresetWarningModalProvider>
            </ExperimentalModalProvider>
        </StorageProvider>
    );
};

export default SettingsStage;
