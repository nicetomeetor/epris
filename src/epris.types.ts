import Epris from './epris';

export type EprisConfig = {
    prefix: string;
}

export type State = {
    [key: string]: any,
}

export type Effects = {
    [key: string]: Function,
}

export type Actions = {
    [key: string]: EventListener,
}

export type VirtualNode = {
    tag: string,
    props: { [key: string]: any },
    children: Array<VirtualNode> | string,
    el?: HTMLElement,
    on: { [key: string]: EventListener },
    key?: number,
};

export type EprisObject = {
    el: string,
    state: State,
    actions: Actions,
    effects: Effects,
};

export interface Element extends HTMLElement {
    on?: { [key: string]: EventListener };
    props?: { [key: string]: any };
}

export type UpdateData = {
    rawValue?: any,
    propValue?: string,
    context: Epris,
    propName?: string,
    propModifierName?: string,
    propModifierValue?: string,
    element: Element,
};

export type ChainData = {
    keys: string[],
    data: string,
};

export type PropModifiers = {
    propModifierName: string,
    propModifierValue: string,
};

export type ActionData = {
    action: string,
    args: string[][],
};
