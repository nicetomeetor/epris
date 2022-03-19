import { parse } from '../epris.vdom';
import { State, Actions, h } from '../epris.types';

export default (
    value: string,
    state: State,
    methods: Actions,
    node: HTMLElement,
) => {
    const children: Array<h> = [];
    const split = node.getAttribute('e-for').split(' ');
    node.removeAttribute('e-for');

    const key = split[0];
    const arrayKey = split[2];

    state[arrayKey].forEach((element: any) => {
        const forState = {};

        Object.defineProperty(forState, key, {
            value: element,
            writable: true,
            enumerable: true,
            configurable: true,
        });

        const parsed = parse(node, forState, methods);
        children.push(parsed);
    });

    return {
        key: 'children',
        value: children,
    };
}