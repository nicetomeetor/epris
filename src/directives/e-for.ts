import { mutate } from '../parser/epris.parser';
import { regExpFor } from '../epris.regexp';
import { removeAllChildNodes } from '../epris.helpers';

export default (
    {
        context,
        node,
        rawValue,
    }: any,
) => {
    const actions = context.actions;
    const state = context.state;
    const effects = context.effects;

    const clone = node.cloneNode(true);

    const split = rawValue.data.match(regExpFor);

    const key = split[1];
    const arrayKey = split[2];
    const array = state[arrayKey];

    const parent = node.parentElement;

    array.forEach((element: any) => {
        const loopClone = clone.cloneNode(true);
        const loopState = {};

        Object.defineProperty(loopState, key, {
            value: element,
            writable: true,
            enumerable: true,
            configurable: true,
        });

        Object.assign(loopState, context.state);

        const loopContext = {
            state: loopState,
            actions,
            effects,
        };

        mutate(loopClone, loopContext);

        parent.insertBefore(loopClone, node);
    });

    removeAllChildNodes(node);
    parent.removeChild(node);
}