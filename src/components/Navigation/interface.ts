import { ReactNode } from 'react';
import { IFocusable } from '../../interface';

export enum NavigationType {
    HORIZONTAL,
    VERTICAL,
}

export interface Props {
    navigationType: NavigationType,
    focusableChildren: React.RefObject<IFocusable>[],
    children?: ReactNode,
    className?: string,
}
