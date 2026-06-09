import React, { ReactNode } from 'react';
import root from 'react-shadow';

import styles from '@assets/styles/index.css?inline';

interface ShadowRootProps {
    children: ReactNode;
}

const ShadowRoot: React.FC<ShadowRootProps> = ({ children }) => (
    <root.span mode="open">
        <style type="text/css">{styles.toString()}</style>
        <span className="pointer-events-auto !z-max inline-block">
            {children}
        </span>
    </root.span>
);

export default ShadowRoot;
