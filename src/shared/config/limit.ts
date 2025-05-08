import { IAttrAction, ISettingsBlock } from 'src/shared/types/config';
import { ISubtitleSettings } from 'src/shared/types/settings';
import { formatTime } from 'src/shared/utils/format';

export const limitConfig: ISettingsBlock<IAttrAction[]> = {
    title: 'Time limit',
    settings: [
        {
            title: 'Daily limit',
            groups: [
                {
                    actions: [],
                    type: 'dropdown',
                    options: [
                        {
                            label: '30 minutes',
                            value: String(30),
                        },
                        {
                            label: '1 hour',
                            value: String(60),
                        },
                        {
                            label: '2 hours',
                            value: String(60 * 2),
                        },
                    ],
                    storageKey: 'dailyTimeLimit',
                },
                {
                    title: 'Time spent today',
                    type: 'subtitle',
                    subtitle: (value: ISubtitleSettings) =>
                        value.value ? formatTime(Number(value.value)) : '0m',
                    actions: [],
                    storageKey: 'spentTimeToday',
                },
            ],
        },
    ],
};
