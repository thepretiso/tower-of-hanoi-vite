import { KeyboardEvent, MouseEvent } from 'react';

export const isClickOrEnter = (event: MouseEvent | KeyboardEvent) => {
    return (
        (event as KeyboardEvent).code === 'Enter'
        || (event as MouseEvent).buttons === 0
        || (event as MouseEvent).button === 0
    );
}
