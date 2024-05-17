export interface IFocusable {
    focus: () => void,
    hasDom?(element: HTMLElement): boolean,
}
