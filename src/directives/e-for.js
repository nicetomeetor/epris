import {parse} from "../epris.vdom";

export default (value, state, methods, node) => {
    const children = [];
    const split = node.getAttribute("e-for").split(' ');
    node.removeAttribute("e-for");

    const key = split[0];
    const arrayKey = split[2];

    state[arrayKey].forEach(element => {
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
    }
}