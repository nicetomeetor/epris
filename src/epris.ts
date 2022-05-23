import {
    patch,
    mount,
} from './epris.vdom';

import {
    parse,
} from './parser/parse';

import {
    reactive,
    watchGlobalEffect,
    watchEffects,
} from './epris.reactivity';

import {
    bindEffects,
    defineActionProperties,
    defineStateProperties,
    isObject,
    filterFuncs,
    mutateElement,
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
        this.state = isObject(object.state) ? reactive(object.state) : {};
        this.actions = isObject(object.actions) ? filterFuncs(object.actions) as Actions : {};
        this.effects = isObject(object.effects) ? filterFuncs(object.effects) as Effects : {};

        defineActionProperties(this);
        defineStateProperties(this);
        bindEffects(this);

        watchEffects(this.effects);

        this.el = document.querySelector(object.el);

        const mutatedElement = mutateElement(this.el, this);

        let parsedNode: VirtualNode = parse(mutatedElement);
        mount(parsedNode, mutatedElement);

        this.el.parentNode.replaceChild(parsedNode.el, this.el);

        watchGlobalEffect(() => {
            const mutatedElement = mutateElement(this.el, this);

            const newNode = parse(mutatedElement);
            patch(parsedNode, newNode);

            parsedNode = newNode;
        });
    }
};
