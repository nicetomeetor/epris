import {
    patch,
    mount,
} from './epris.vdom';

import {
    mutate,
    parse,
} from './parser/epris.parser';

import {
    reactive,
    watchGlobalEffect,
    watchEffects,
} from './epris.reactivity';

import {
    bindEffects,
    defineActionProperties,
    defineStateProperties,
} from './epris.helpers';

import {
    Actions,
    State,
    VirtualNode,
    EprisObject,
    Effects,
} from './epris.types';

export default class Epris {
    actions: Actions;
    state: State;
    el?: HTMLElement;
    effects: Effects;

    constructor(object: EprisObject) {
        this.state = reactive(object.state);
        this.actions = object.actions|| {};
        this.effects = object.effects || {};

        defineActionProperties(this);
        defineStateProperties(this);
        bindEffects(this);

        watchEffects(this.effects);

        this.el = document.querySelector(object.el);

        let parsedNode: VirtualNode;

        watchGlobalEffect(() => {
            const newEl = this.el.cloneNode(true);
            mutate(newEl as HTMLElement, this);

            if (!parsedNode) {
                parsedNode = parse(newEl as HTMLElement);
                mount(parsedNode, newEl as HTMLElement);
                this.el.parentNode.replaceChild(parsedNode.el, this.el);
            } else {
                const newNode = parse(newEl as HTMLElement);
                patch(parsedNode, newNode);
                parsedNode = newNode;
            }
        });
    }
};
