import { mount, patch } from './epris.vdom';
import { parse } from './epris.parser'
import { reactive, watchEffect } from './epris.reactivity';
import { Actions, State, VirtualNode, EprisObject } from './epris.types';

export default class Epris {
    actions: Actions;
    state: State;
    el:  HTMLElement;

    constructor(object: EprisObject) {
        const el = object.el;
        const state = object.state;
        const actions = object.actions;

        this.actions = this.defineActionProperties(actions);
        this.state = reactive(state);
        this.el = document.querySelector(el);

        this.defineStateProperties(this.state);

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
                            return this.state[key];
                        },
                        set(newValue) {
                            this.state[key] = newValue;
                        },
                    });
            });
    }
};
