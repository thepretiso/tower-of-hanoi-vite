import React, { createRef, KeyboardEvent, MouseEvent } from 'react';
import { isClickOrEnter } from '../../utils/isClickOrEnter';
import { Props } from './interface';

export const Interactable = React.forwardRef<HTMLDivElement, Props>(
    ({ children, onPress, className, ...otherProps }, ref) => {
        const domRef = ref || createRef<HTMLDivElement>();

        const onPressProxy = (e: KeyboardEvent | MouseEvent) => {
            if (typeof onPress === 'function' && isClickOrEnter(e)) {
                onPress(e);
            }
        };

        const onMouseEnter = () => {
            if (ref && typeof ref !== 'function') {
                ref.current!.focus();
            }
        };

        return (
            <div
                {...otherProps}
                ref={domRef}
                className={className}
                onMouseEnter={onMouseEnter}
                onClick={onPressProxy}
                onKeyDown={onPressProxy}
                tabIndex={0}
            >
                {children}
            </div>
        );
    },
);
