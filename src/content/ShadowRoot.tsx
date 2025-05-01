import root from 'react-shadow';

import styles from '@assets/styles/index.css?inline';

import { forwardRef, ReactNode } from 'react';
import React from 'react';

interface IShadowRoot {
    children: ReactNode;
}

const ShadowRoot = forwardRef<HTMLDivElement, IShadowRoot>(
    ({ children }, ref) => (
        <root.div mode="open" ref={ref}>
            <style type="text/css">{styles.toString()}</style>
            <div
                id="leninc-search-bar-sr"
                className="pointer-events-auto !z-max"
            >
                {children}
            </div>
        </root.div>
    )
);

export default ShadowRoot;
