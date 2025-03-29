import React, { forwardRef, ReactNode } from 'react';
import root from 'react-shadow';

// import styles from '@assets/styles';

interface IShadowRoot {
    children: ReactNode;
}

const ShadowRoot = forwardRef<HTMLDivElement, IShadowRoot>(
    ({ children }, ref) => (
        <root.div mode="open" ref={ref}>
            {/*<style type="text/css">{styles.toString()}</style>*/}
            <div id="yt-boost-clean">{children}</div>
        </root.div>
    )
);

export default ShadowRoot;
