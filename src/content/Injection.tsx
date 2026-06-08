import React, { ReactNode, useLayoutEffect, useState } from 'react';
import ReactDOM from 'react-dom';

export interface InjectionProps {
    selectTargetElement: () => Element | HTMLElement | null | undefined;
    containerTagName?: keyof HTMLElementTagNameMap;
    containerClassName?: string;
    children: ReactNode;
    position?: InsertPosition;
}

export const Injection: React.FC<InjectionProps> = ({
    selectTargetElement,
    containerTagName = 'span',
    children,
    containerClassName,
    position = 'afterend',
}) => {
    const [containerEl, setContainerEl] = useState<null | HTMLElement>(null);

    useLayoutEffect(() => {
        const targetEl = selectTargetElement();
        let nextContainerEl: HTMLElement | null = null;

        if (targetEl) {
            nextContainerEl = document.createElement(containerTagName);
            if (containerClassName) {
                nextContainerEl.classList.add(containerClassName);
            }
            targetEl.insertAdjacentElement(position, nextContainerEl);
            setContainerEl(nextContainerEl);
        }

        return () => {
            if (nextContainerEl) {
                nextContainerEl.remove();
            }
        };
    }, [containerClassName, containerTagName, position, selectTargetElement]);

    if (containerEl === null) return null;
    return ReactDOM.createPortal(children, containerEl);
};
