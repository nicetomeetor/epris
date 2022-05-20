export interface Element extends HTMLElement {
    on?: { [key: string]: EventListener };
    props?: { [key: string]: any };
}

export interface ControlledElement extends HTMLElement {
    checked: boolean,
    value: string,
}