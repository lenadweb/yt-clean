import React, { FC, FormEvent, useState } from 'react';
import cn from 'classnames';
import { useStorage, useStorageValue } from 'src/shared/hooks/useStorage';
import {
    addKeyword,
    KEYWORD_FILTER_MAX_LENGTH,
} from 'src/shared/videoFilter/keywords';
import FilterGroupHeader from 'src/sidebar/components/FilterGroupHeader';
import { t } from 'src/shared/utils/i18n';

const KeywordFilter: FC = () => {
    const [settings] = useStorage();
    const [filter, setFilter] = useStorageValue('keywordFilter');
    const [draft, setDraft] = useState('');
    const enabled = settings.isEnabled;
    const isGrey = !enabled || !filter.enabled;
    const canAdd = enabled && draft.trim().length > 0;

    const submit = (event: FormEvent) => {
        event.preventDefault();
        if (!canAdd) return;

        const keywords = addKeyword(filter.keywords, draft);
        if (keywords !== filter.keywords) {
            setFilter({ ...filter, keywords });
        }
        setDraft('');
    };

    const remove = (keyword: string) => {
        setFilter({
            ...filter,
            keywords: filter.keywords.filter((item) => item !== keyword),
        });
    };

    return (
        <div className="last:!mb-2">
            <FilterGroupHeader
                title="hide_by_keywords"
                hint="keyword_filter_hint"
                enabled={filter.enabled}
                onToggle={(value) => setFilter({ ...filter, enabled: value })}
            />
            <div className="ml-3 flex flex-col gap-3">
                <form
                    onSubmit={submit}
                    className={cn(
                        'group flex h-9 items-center gap-2 rounded-xl border border-black-600 bg-background pl-3 pr-1 transition-colors',
                        enabled
                            ? 'hover:border-black-500 focus-within:!border-black-400'
                            : 'opacity-60'
                    )}
                >
                    <input
                        type="text"
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        maxLength={KEYWORD_FILTER_MAX_LENGTH}
                        disabled={!enabled}
                        placeholder={t('keyword_filter_placeholder')}
                        aria-label={t('keyword_filter_placeholder')}
                        className="min-w-0 flex-1 bg-transparent text-sm font-light text-white caret-red-accent placeholder:text-black-400 focus:outline-none"
                    />
                    <button
                        type="submit"
                        disabled={!canAdd}
                        aria-label={t('keyword_filter_add')}
                        title={t('keyword_filter_add')}
                        className={cn(
                            'flex size-7 shrink-0 items-center justify-center rounded-lg transition active:scale-95',
                            canAdd
                                ? 'cursor-pointer bg-red-accent text-white'
                                : 'cursor-default text-black-500'
                        )}
                    >
                        <svg
                            width="10"
                            height="10"
                            viewBox="0 0 10 10"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        >
                            <path d="M5 1v8M1 5h8" />
                        </svg>
                    </button>
                </form>
                {filter.keywords.length > 0 && (
                    <ul className="flex flex-wrap gap-1.5">
                        {filter.keywords.map((keyword) => (
                            <li
                                key={keyword}
                                className={cn(
                                    'flex max-w-full items-center gap-1 rounded-xl bg-black-600 py-1 pl-3 pr-1 text-[12px] transition-colors',
                                    isGrey ? 'text-black-400' : 'text-white-100'
                                )}
                            >
                                <span className="truncate">{keyword}</span>
                                <button
                                    type="button"
                                    onClick={() => remove(keyword)}
                                    disabled={!enabled}
                                    aria-label={`${t('keyword_filter_remove')}: ${keyword}`}
                                    className="flex size-5 shrink-0 items-center justify-center rounded-lg text-black-400 transition-colors enabled:cursor-pointer enabled:hover:bg-black-500 enabled:hover:text-white"
                                >
                                    <svg
                                        width="8"
                                        height="8"
                                        viewBox="0 0 8 8"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    >
                                        <path d="M1 1l6 6M7 1L1 7" />
                                    </svg>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default KeywordFilter;
