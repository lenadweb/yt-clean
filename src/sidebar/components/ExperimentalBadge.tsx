import React, { FC } from 'react';
import cn from 'classnames';
import { t } from 'src/shared/utils/i18n';

type Props = {
    className?: string;
};

export const ExperimentalBadge: FC<Props> = ({ className }) => (
    <span
        className={cn(
            'inline-flex shrink-0 items-center rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-medium uppercase leading-none tracking-wide text-black',
            className
        )}
    >
        {t('experimental')}
    </span>
);
