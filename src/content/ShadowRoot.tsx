import root from 'react-shadow';

import styles from '@assets/styles/index.css?inline';

import { forwardRef, ReactNode } from 'react';
import React from 'react';

interface IShadowRoot {
    children: ReactNode;
}

const ShadowRoot = forwardRef<HTMLDivElement, IShadowRoot>(
    ({ children }, ref) => (
        <root.span mode="open" ref={ref}>
            <style type="text/css">{styles.toString()}</style>
            <span
                id="leninc-search-bar-sr"
                className="pointer-events-auto !z-max inline-block"
            >
                {children}
            </span>
        </root.span>
    )
);

export default ShadowRoot;
