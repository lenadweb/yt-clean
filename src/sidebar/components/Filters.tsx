import React, { FC } from 'react';
import { Accordion } from 'src/sidebar/components/SettingsAccordion';
import KeywordFilter from 'src/sidebar/components/KeywordFilter';
import DurationFilter from 'src/sidebar/components/DurationFilter';
import Divider from 'src/sidebar/components/Divider';

const Filters: FC = () => (
    <Accordion title="filters" isNew>
        <KeywordFilter />
        <Divider />
        <DurationFilter />
    </Accordion>
);

export default Filters;
