const mouseDownHandler = (event: MouseEvent) => {
    event.preventDefault();
};

export const enablePreventLostFocus = (elementId: string) => {
    document.getElementById(elementId)?.addEventListener('mousedown', mouseDownHandler);
}

export const disablePreventLostFocus = (elementId: string) => {
    document.getElementById(elementId)?.addEventListener('mousedown', mouseDownHandler);
}
