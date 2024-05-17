import { SyntheticEvent } from "react";

export const stopEvent = (event: SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
};
