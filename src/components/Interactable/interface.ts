import { KeyboardEvent, MouseEvent } from 'react';

export type Props = {
    onPress?: (event: KeyboardEvent | MouseEvent) => void,
} & React.HTMLAttributes<HTMLDivElement>;
