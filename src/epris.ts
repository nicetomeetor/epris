import { mount, patch, parse } from './epris.vdom';
import { reactive, watchEffect } from './epris.reactivity';
import { Actions, Getters, h, State } from './epris.types';

interface EprisObject {
    el: string,
    state: State,
    actions: Actions
    getters: Getters
}

export default class Epris {
    $actions: Actions;
    $state: State;
    $getters: any;

    constructor(object: EprisObject) {
        const el = object.el;
        const state = object.state;
        const actions = object.actions;
        const getters = object.getters;

        this.$actions = this.bindActions(actions);
        this.$state = reactive(state);

        this.defineProperties(this.$state);
        this.defineProperties(this.$actions);

        const node: HTMLElement = document.querySelector(el);
        let parsedNode: h;

        watchEffect(() => {
            if (!parsedNode) {
                parsedNode = parse(node, this.$state, this.$actions);
                mount(parsedNode, node);
                node.parentNode.replaceChild(parsedNode.$el, node);
            } else {
                const newNode = parse(node, this.$state, this.$actions);
                patch(parsedNode, newNode);
                parsedNode = newNode;
            }
        });
        console.log(parsedNode)
    }

    private bindActions(actions: Actions) {
        Object
            .entries(actions)
            .forEach(([name, func]) => {
                actions[name] = func.bind(this);
            });
        return actions;
    }

    private defineProperties(data: State | Actions) {
        Object
            .entries(data)
            .forEach(([key, value]) => {
                Object.defineProperty(this, key, {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value,
                });
            });
    }
};
