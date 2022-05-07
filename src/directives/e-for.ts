import { mutate } from '../epris.parser';
import { regExpFor } from '../epris.regexp';

export default (
    {
        context,
        node,
        rawValue,
    }: any
) => {
    const actions = context.actions;
    const state = context.state;
    const effects = context.effects

    const split = rawValue.data.match(regExpFor);

    const key = split[1];
    const arrayKey = split[2];
    const array = state[arrayKey];

    const parent = node.parentElement;

    array.forEach((element: any) => {
        const clone = node.cloneNode(true);
        const loopState = {};

        Object.defineProperty(loopState, key, {
            value: element,
            writable: true,
            enumerable: true,
            configurable: true,
        });

        Object.assign(loopState, context.state)

        const loopContext = {
            state: loopState,
            actions,
            effects
        }

        mutate(clone, loopContext)

        parent.insertBefore(clone, node);
    });

    removeAllChildNodes(node);

    parent.removeChild(node);
}

const removeAllChildNodes = (parent: any) => {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}