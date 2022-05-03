import { patch, mount } from './epris.vdom';
import { mutate, parse } from './epris.parser';
import { reactive, watchEffect } from './epris.reactivity';
import { Actions, State, VirtualNode, EprisObject } from './epris.types';
import { defineActionProperties, defineStateProperties } from './epris.helpers';

export default class Epris {
    actions: Actions;
    state: State;
    el?: HTMLElement;

    constructor(object: EprisObject) {
        this.state = reactive(object.state);
        this.actions = object.actions;

        defineActionProperties(this);
        defineStateProperties(this);

        this.el = document.querySelector(object.el);

        let parsedNode: VirtualNode;

        watchEffect(() => {
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
