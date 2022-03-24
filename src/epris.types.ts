export type EprisConfig = {
    prefix: string;
}

export type State = {
    [key: string]: any
}

export type Actions = {
    [key: string]: EventListener
}

export type Getters = {
    [key: string]: Function
}

export type h = {
    tag: string,
    props: { [key: string]: string },
    children: Array<h> | string,
    $el?: HTMLElement
};
