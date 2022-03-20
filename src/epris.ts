import { mount, patch, parse } from './epris.vdom';
import { reactive, watchEffect } from './epris.reactivity';
import { Actions, Getters, State } from './epris.types';

interface EprisObject {
    el: string,
    state: State,
    actions: Actions
    getters: Getters
}

export default class Epris {
    private $actions: Actions;
    private $state: State;
    private $getters: any;

    constructor(object: EprisObject) {
        const el = object.el;
        const state = object.state;
        const actions = object.actions;
        const getters = object.getters;

        this.$actions = this.bindActions(actions);

        this.$state = reactive(state);

        this.defineProperties(this.$state);
        this.defineProperties(this.$actions);

        const node = document.getElementById(el);
        let parsedNode: any;

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
    }

    bindActions(actions: Actions) {
        Object
            .entries(actions)
            .forEach(([name, func]) => {
                actions[name] = func.bind(this);
            });
        return actions;
    }

    defineProperties(data: { [key: string]: any }) {
        Object
            .entries(data)
            .forEach(([key, value]) => {
                Object.defineProperty(this, key, {
                    enumerable: false,
                    configurable: false,
                    writable: false,
                    value,
                });
            });
    }
};
