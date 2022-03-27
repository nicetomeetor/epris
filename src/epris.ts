import { mount, patch } from './epris.vdom';
import { parse } from './epris.parser'
import { reactive, watchEffect } from './epris.reactivity';
import { Actions, Getters, State, VirtualNode } from './epris.types';

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
    $el:  HTMLElement;

    constructor(object: EprisObject) {
        const el = object.el;
        const state = object.state;
        const actions = object.actions;
        const getters = object.getters;

        this.$actions = this.defineActionProperties(actions);
        this.$state = reactive(state);
        this.$getters = getters
        this.$el = document.querySelector(el);

        this.defineStateProperties(this.$state);

        let parsedNode: VirtualNode;

        watchEffect(() => {
            if (!parsedNode) {
                parsedNode = parse(this.$el, this.$state, this.$actions);
                mount(parsedNode, this.$el);
                this.$el.parentNode.replaceChild(parsedNode.$el, this.$el);
            } else {
                const newNode = parse(this.$el, this.$state, this.$actions);
                patch(parsedNode, newNode);
                parsedNode = newNode;
            }
        });
    }

    private defineActionProperties(actions: Actions) {
        Object
            .entries(actions)
            .forEach(([name, func]) => {
                actions[name] = func.bind(this);
                Object
                    .defineProperty(this, name, {
                        enumerable: true,
                        value: func,
                    });
            });

        return actions;
    }

    private defineStateProperties(data: State) {
        Object
            .keys(data)
            .forEach((key) => {
                Object
                    .defineProperty(this, key, {
                        enumerable: true,
                        get() {
                            return this.$state[key];
                        },
                        set(newValue) {
                            this.$state[key] = newValue;
                        },
                    });
            });
    }
};
