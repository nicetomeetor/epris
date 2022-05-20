import Epris from './epris';

import {
    Element,
} from './epris.interfaces';

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
    on: { [key: string]: EventListener },
    el?: HTMLElement,
    key?: number,
};

export type EprisObject = {
    el: string,
    state: State,
    actions: Actions,
    effects: Effects,
};

export type UpdateData = {
    context: Epris,
    element: Element,
    rawValue?: ChainData,
    propValue?: string,
    propName?: string,
    propModifierName?: string,
    propModifierValue?: string,
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
