import { mount, patch } from './epris.vdom';
import { parse } from './epris.parser'
import { reactive, watchEffect } from './epris.reactivity';
import { Actions, State, VirtualNode, EprisObject } from './epris.types';
import { defineActionProperties, defineStateProperties } from './epris.helpers';

export default class Epris {
    actions: Actions;
    state: State;
    el?:  HTMLElement;

    constructor(object: EprisObject) {
        const el = object.el;

        this.state = reactive(object.state)
        this.actions = object.actions;

        defineActionProperties(this)

        this.el = document.querySelector(el);

        defineStateProperties(this)

        let parsedNode: VirtualNode;

        watchEffect(() => {
            if (!parsedNode) {
                parsedNode = parse(this.el, this);
                mount(parsedNode, this.el);
                this.el.parentNode.replaceChild(parsedNode.el, this.el);
            } else {
                const newNode = parse(this.el, this);
                patch(parsedNode, newNode);
                parsedNode = newNode;
            }
        });
    }
};
